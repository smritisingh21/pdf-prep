import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddings } from "../config/ollama.js";

let vectorStore = null;

export async function initializeVectorStore() {
  if (!vectorStore) {
    vectorStore = await MemoryVectorStore.fromDocuments([], embeddings);
    console.log("In-memory vector store initialized");
  }

  return vectorStore;
}

export async function storeDocumentChunks(chunks) {
  const store = await initializeVectorStore();

  await store.addDocuments(chunks);

  console.log(`Stored ${chunks.length} chunks`);
}

export async function retrieveRelevantChunks(query, k = 5) {
  const store = await initializeVectorStore();

  return await store.similaritySearch(query, k);
}