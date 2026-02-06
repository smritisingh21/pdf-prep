import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});
