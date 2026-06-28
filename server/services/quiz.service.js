import { llm } from "../config/ollama.js";
import { retrieveRelevantChunks } from "./rag.service.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const quizPrompt = PromptTemplate.fromTemplate(`
You are a helpful tutor creating quiz questions from the provided content.

Generate exactly 5 multiple-choice questions.

Rules:
- Each question must have exactly 4 options.
- correctAnswer must be the ZERO-BASED index (0,1,2,3).
- Return ONLY valid JSON.
- Do not wrap the JSON in markdown.

Return in this format:

{{
  "questions": [
    {{
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 2
    }}
  ]
}}

Content:

{context}
`);

export async function createQuiz(query = "important concepts") {
  try {
    const docs = await retrieveRelevantChunks(query, 5);

    const context = docs
      .map((doc) => doc.pageContent)
      .join("\n\n");

    if (!context) {
      throw new Error("No relevant content found.");
    }

    const chain = RunnableSequence.from([
      quizPrompt,
      llm,
    ]);

    const response = await chain.invoke({ context });

    // AIMessage -> string
    const text = response.content;

    console.log("LLM Response:");
    console.log(text);

    return JSON.parse(text);

  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}