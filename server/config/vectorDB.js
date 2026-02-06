import { Chroma } from "langchain/vectorstores/chroma";
import { embeddings } from "./openai.js";

export async function getVectorStore() {
  return await Chroma.fromExistingCollection(embeddings, {
    collectionName: "pdf-notes",
  });
}
