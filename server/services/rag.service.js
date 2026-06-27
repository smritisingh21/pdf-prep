import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "../config/ollama.js";

let vectorStore = null;

export async function initializeVectorStore() {
  try {
    vectorStore = await Chroma.getInstance({
      collectionName: "pdf-documents",
      url: process.env.CHROMA_URL || "http://localhost:8000",
    });
    console.log("Vector store initialized successfully");
  } catch (error) {
    console.error("Failed to initialize vector store:", error);
    throw error;
  }
}

export async function retrieveRelevantChunks(query, topK = 5) {
  if (!vectorStore) {
    await initializeVectorStore();
  }

  try {
    const results = await vectorStore.similaritySearch(query, topK);
    return results;
  } catch (error) {
    console.error("Error retrieving chunks:", error);
    throw error;
  }
}

export async function storeDocumentChunks(chunks) {
  if (!vectorStore) {
    await initializeVectorStore();
  }

  try {
    await Chroma.fromDocuments(chunks, embeddings, {
      collectionName: "pdf-documents",
      url: process.env.CHROMA_URL || "http://localhost:8000",
    });
    console.log("Document chunks stored successfully");
  } catch (error) {
    console.error("Error storing chunks:", error);
    throw error;
  }
}
