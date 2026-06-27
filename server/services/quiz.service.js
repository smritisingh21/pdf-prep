import { llm } from "../config/ollama.js";
import { retrieveRelevantChunks } from "./rag.service.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const quizPrompt = PromptTemplate.fromTemplate(`
You are a helpful tutor creating quiz questions from provided content.
Generate 5 multiple-choice questions with 4 options each and mark the correct answer.
Return the response as valid JSON only with this structure:
{{
  "questions": [
    {{
      "question": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0
    }}
  ]
}}

Content to create questions from:
{context}
`);

export async function createQuiz(query = "important concepts") {
  try {
    // 1. Retrieve relevant PDF chunks
    const docs = await retrieveRelevantChunks(query, 5);

    // 2. Combine text from retrieved documents
    const context = docs.map((d) => d.pageContent).join("\n---\n");

    if (!context) {
      throw new Error("No relevant content found in vector store");
    }

    // 3. Create chain and invoke
    const chain = RunnableSequence.from([
      quizPrompt,
      llm,
    ]);

    const response = await chain.invoke({ context });

    // Parse the response to ensure valid JSON
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      // If response isn't JSON, wrap it
      return { questions: [{ question: response, options: [], correctAnswer: -1 }] };
    }
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
