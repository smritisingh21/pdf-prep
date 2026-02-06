import { ChatOpenAI } from "langchain/chat_models/openai";
import { retrieveRelevantChunks } from "./rag.service.js";
import { QUIZ_PROMPT } from "../prompts/quiz.prompt.js";

const llm = new ChatOpenAI({ temperature: 0.3 });

export async function createQuiz() {
  // 1. Retrieve relevant PDF chunks
  const docs = await retrieveRelevantChunks("important concepts");

  // 2. Combine text
  const context = docs.map(d => d.pageContent).join("\n");

  // 3. Ask the LLM
  const response = await llm.invoke(
    QUIZ_PROMPT.replace("{context}", context)
  );

  return response.content;
}
