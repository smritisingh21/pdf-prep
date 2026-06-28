import { useState } from "react";
import UploadPDF from "../components/UploadPDF";
import QuizPage from "./QuizPage";

function UploadPage() {
  const [ready, setReady] = useState(false);

  return (
    <div>

      {!ready && <UploadPDF onUploaded={() => setReady(true)} />}

      {ready && <QuizPage />}
    </div>
  );
}

export default UploadPage;
