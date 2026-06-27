import { processPDF } from "../services/pdf.service.js";

export async function uploadPDF(req, res) {
  try {
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        error: "No PDF uploaded",
      });
    }

    const result = await processPDF(req.file.path);

    res.json({
      message: "PDF processed successfully",
      ...result,
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    res.status(500).json({
      error: "Failed to process PDF",
      message: error.message,
    });
  }
}