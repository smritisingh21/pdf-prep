import { llm } from "./config/ollama.js";

const messages = `
You are a helpful assistant.
Explain JavaScript closures simply.
`;

const result = await llm.invoke(messages);
console.log("Response:", result);

