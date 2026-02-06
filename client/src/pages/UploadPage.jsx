import { useState } from "react";
import UploadPDF from "../components/UploadPDF";
import QuizPage from "./QuizPage";

function UploadPage() {
  const [ready, setReady] = useState(false);

  return (
    <div>
      <h1>AI Notes & Quiz Generator</h1>

      {!ready && <UploadPDF onUploaded={() => setReady(true)} />}

      {ready && <QuizPage />}
    </div>
  );
}

export default UploadPage;
