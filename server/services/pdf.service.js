import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { splitText } from "./chunk.service.js";
import { storeEmbeddings } from "./embedding.service.js";

export async function processPDF(filePath) {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  const chunks = await splitText(docs);
  await storeEmbeddings(chunks);
}
