import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import flashcardRoutes from "./routes/flashcard.routes.js";
import quizRoutes from "./routes/quiz.routes.js"
import dotenv from "dotenv";
import { llm } from "./config/ollama.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/upload", uploadRoutes);
app.use("/quiz", quizRoutes);
app.use("/flashcards", flashcardRoutes);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test Ollama connection
    const testResponse = await llm.invoke("Say hello briefly");
    res.json({ 
      status: "OK", 
      message: "Server is running and Ollama is connected",
      ollamaConnected: true
    });
  } catch (error) {
    console.error("Ollama connection failed:", error.message);
    res.status(503).json({ 
      status: "ERROR", 
      message: "Ollama is not connected",
      ollamaConnected: false,
      details: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("Ollama is running at http://localhost:11434");
  console.log("POST /upload - Upload PDF file");
  console.log("GET /quiz?query=<topic> - Generate quiz");
  console.log("GET /flashcards?query=<topic> - Generate flashcards");
});

