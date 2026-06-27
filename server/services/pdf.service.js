import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { splitText } from "./chunk.service.js";
import { storeEmbeddings } from "./embedding.service.js";

export async function processPDF(filePath) {
  try {
    console.log(`Processing PDF: ${filePath}`);
    
    // 1. Load PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents from PDF`);

    // 2. Split into chunks
    const chunks = await splitText(docs);
    console.log(`Split into ${chunks.length} chunks`);

    // 3. Store embeddings in vector database
    await storeEmbeddings(chunks);
    
    console.log("PDF processing completed successfully");
    return { success: true, chunksProcessed: chunks.length };
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
}
