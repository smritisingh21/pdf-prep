import { llm } from "../config/ollama.js";
import { retrieveRelevantChunks } from "./rag.service.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const flashcardPrompt = PromptTemplate.fromTemplate(`
You are an expert educator creating flashcards for study from provided content.
Generate 10 flashcards with questions on the front and answers on the back.
Focus on key concepts, definitions, and important facts.
Return the response as valid JSON only with this structure:
{{
  "flashcards": [
    {{
      "front": "question or concept",
      "back": "answer or explanation"
    }}
  ]
}}

Content to create flashcards from:
{context}
`);

export async function createFlashcards(query = "key concepts definitions") {
  try {
    // 1. Retrieve relevant PDF chunks
    const docs = await retrieveRelevantChunks(query, 8);

    // 2. Combine text from retrieved documents
    const context = docs.map((d) => d.pageContent).join("\n---\n");

    if (!context) {
      throw new Error("No relevant content found in vector store");
    }

    // 3. Create chain and invoke
    const chain = RunnableSequence.from([
      flashcardPrompt,
      llm,
    ]);

    const response = await chain.invoke({ context });

    // Parse the response to ensure valid JSON
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      // If response isn't JSON, wrap it
      return { 
        flashcards: [{ 
          front: "Content", 
          back: response 
        }] 
      };
    }
  } catch (error) {
    console.error("Error creating flashcards:", error);
    throw error;
  }
}
