import { getVectorStore } from "../config/vectorDB.js";

export async function retrieveRelevantChunks(query) {
  const vectorStore = await getVectorStore();

  return await vectorStore.similaritySearch(query, 5);
}
