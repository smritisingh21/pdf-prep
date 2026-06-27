import { createFlashcards } from "../services/flashcard.service.js";

export async function generateFlashcards(req, res) {
  try {
    const { query } = req.query;
    const flashcards = await createFlashcards(query);
    res.json(flashcards);
  } catch (error) {
    console.error("Flashcard generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate flashcards",
      message: error.message 
    });
  }
}
