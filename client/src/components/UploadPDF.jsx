import { useState } from "react";
import uploadPDF  from "../api/backend.js";

function UploadPDF({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await uploadPDF(file);
      console.log("Upload successful:", result);
      onUploaded();
    } catch (err) {
      setError(err.message || "Upload failed");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing PDF..." : "Upload PDF"}
      </button>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default UploadPDF;
