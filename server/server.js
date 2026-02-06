import express from "express";
import uploadRoutes from "./routes/upload.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import dotenv from "dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";


dotenv.config();

const app = express();
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/quiz", quizRoutes);


const llm = new ChatOpenAI();
const res = await llm.invoke("Say hello in one sentence");
console.log(res.content);


app.listen("3000" , () =>{
    console.log("Server listening on port 3000");
})

