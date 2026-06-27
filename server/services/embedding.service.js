import { storeDocumentChunks } from "./rag.service.js";

export async function storeEmbeddings(chunks) {
  try {
    await storeDocumentChunks(chunks);
    console.log(`Stored ${chunks.length} document chunks with embeddings`);
  } catch (error) {
    console.error("Error storing embeddings:", error);
    throw error;
  }
}
