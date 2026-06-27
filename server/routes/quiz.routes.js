import express from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";

const router = express.Router();

router.get("/", generateQuiz);

export default router;
