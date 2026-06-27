import { createQuiz } from "../services/quiz.service.js";

export async function generateQuiz(req, res) {
  try {
    const { query } = req.query;
    const quiz = await createQuiz(query);
    res.json(quiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate quiz",
      message: error.message 
    });
  }
}
