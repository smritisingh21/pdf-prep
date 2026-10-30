import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

// LLM for generation
export const llm = new ChatOllama({
  model: "mistral",
  baseUrl,
  temperature: 0.3,
});

// Embedding model
export const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl,
});