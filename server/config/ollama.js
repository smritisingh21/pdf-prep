import { Ollama } from "@langchain/ollama";

// Initialize Ollama LLM

export const llm = new Ollama({
  model: "mistral", // or use "neural-chat", "llama2", "dolphin-mixtral", etc.
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.3,
});

// For embeddings, we'll use Ollama embeddings as well
export const embeddings = new Ollama({
  model: "nomic-embed-text", // efficient embedding model
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
});
