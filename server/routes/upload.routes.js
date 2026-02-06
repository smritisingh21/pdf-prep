import express from "express";
import { uploadPDF } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", uploadPDF);

export default router;
