import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";

// LLM for generation
export const llm = new ChatOllama({
  model: "mistral",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.3,
});

// Embedding model
export const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
});