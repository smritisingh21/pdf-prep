import { useState } from "react";
import uploadPDF  from "../api/backend.js";

function UploadPDF({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    await uploadPDF(file);
    setLoading(false);

    onUploaded();
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
    </div>
  );
}

export default UploadPDF;
