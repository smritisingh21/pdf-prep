import { processPDF } from "../services/pdf.service.js";

export async function uploadPDF(req, res) {
  try {
    await processPDF("sample.pdf"); // later this comes from upload
    res.json({ message: "PDF processed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to process PDF" });
  }
}
