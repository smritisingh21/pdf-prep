import { llm } from "../config/ollama.js";
import { retrieveRelevantChunks } from "./rag.service.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const flashcardPrompt = PromptTemplate.fromTemplate(`
You are an expert tutor creating study flashcards from the provided content.

Generate 10 high-quality flashcards for study.
Focus on key concepts, essential definitions, core principles, formulas, and important facts.

RULES:
- Return ONLY valid raw JSON.
- Do NOT wrap the JSON in markdown code fences like \`\`\`json or \`\`\`.
- Do NOT include any commentary, explanations, or conversational filler.
- Each flashcard must have a "front" (question or concept prompt) and a "back" (clear, accurate explanation or answer).

Return strictly in this JSON format:
{{
  "flashcards": [
    {{
      "front": "What is...",
      "back": "It is..."
    }}
  ]
}}

Content to create flashcards from:
{context}
`);

export async function createFlashcards(query = "key concepts definitions principles") {
  try {
    // 1. Retrieve relevant PDF chunks from vector store
    const docs = await retrieveRelevantChunks(query, 8);

    // 2. Combine text from retrieved documents
    const context = docs.map((d) => d.pageContent).join("\n\n---\n\n");

    if (!context || context.trim().length === 0) {
      throw new Error("No relevant content found in vector store. Please upload a PDF first.");
    }

    // 3. Create chain and invoke
    const chain = RunnableSequence.from([
      flashcardPrompt,
      llm,
    ]);

    const response = await chain.invoke({ context });

    // Handle AIMessage or string response
    const rawText = typeof response?.content === "string"
      ? response.content
      : typeof response === "string"
        ? response
        : JSON.stringify(response);

    console.log("LLM Flashcard Response length:", rawText.length);

    // Clean markdown code blocks if the LLM outputted them
    const cleanedText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed?.flashcards) && parsed.flashcards.length > 0) {
        return parsed;
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { flashcards: parsed };
      }
    } catch (parseErr) {
      console.warn("Direct JSON.parse failed on flashcard response, attempting regex fallback:", parseErr.message);
      // Attempt to extract JSON object with regex
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed?.flashcards) && parsed.flashcards.length > 0) {
          return parsed;
        }
      }

      // Attempt to extract JSON array
      const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { flashcards: parsed };
        }
      }
      throw new Error("Failed to parse flashcards JSON from model output");
    }

    return { flashcards: [] };
  } catch (error) {
    console.error("Error creating flashcards:", error);
    throw error;
  }
}
