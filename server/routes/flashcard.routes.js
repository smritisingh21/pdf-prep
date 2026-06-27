import express from "express";
import { generateFlashcards } from "../controllers/flashcard.controller.js";

const router = express.Router();

router.get("/", generateFlashcards);

export default router;
