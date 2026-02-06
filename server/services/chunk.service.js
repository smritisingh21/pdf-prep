import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function splitText(docs) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return await splitter.splitDocuments(docs);
}
