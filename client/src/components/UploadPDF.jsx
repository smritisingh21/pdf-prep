import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import uploadPDF from "../api/backend";
import { FileBadgeIcon } from "lucide-react";

function UploadPDF({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      await uploadPDF(file);
      onUploaded();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] min-w-full">

      <main className="max-w-5xl mx-auto px-8 pt-24">

        <div className="text-center">

          <p className="text-blue-600 font-medium mb-3">
            
          </p>

          <h1 className="text-6xl font-bold text-zinc-900 tracking-tight">
            Learning accelerated with AI
          </h1>

          <p className="mt-6 text-xl text-zinc-500 max-w-2xl mx-auto leading-8">
            Upload lecture notes, research papers, or books and instantly
            generate quizzes, flashcards and summaries using AI.
          </p>

        </div>

        {/* Upload Area */}

        <div className="mt-20">

          <label className="group cursor-pointer">

            <div className="border-2 border-dashed border-zinc-300 rounded-3xl bg-white hover:bg-zinc-50 transition-all duration-200">

              <div className="py-24 flex flex-col items-center">

                <UploadCloud
                  className="text-zinc-400 group-hover:scale-110 transition"
                  size={54}
                  strokeWidth={1.5}
                />

                <h2 className="mt-6 text-2xl font-semibold text-zinc-900">
                  Drop your PDF here
                </h2>

                <p className="mt-2 text-zinc-500">
                  or click to browse
                </p>

                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />

              </div>

            </div>

          </label>

          {file && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="text-blue-600" size={22} />
                </div>

                <div>

                  <p className="font-medium text-zinc-900">
                    {file.name}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                </div>

              </div>

            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className=" flex gap-3 mt-10 mb-60">
            <button
            disabled={!file || loading}
            onClick={handleUpload}
            className="mt-2 w-full rounded-2xl bg-green-700 py-4 text-white font-medium hover:bg-black disabled:bg-zinc-300 disabled:text-zinc-500 transition"
          >
            {loading ? "Processing PDF..." : "Generate Quiz"}
          </button>
          <button
            disabled={!file || loading}
            onClick={handleUpload}
            className="mt-2 w-full rounded-2xl bg-blue-500 py-4 text-white font-medium hover:bg-black disabled:bg-zinc-300 disabled:text-zinc-500 transition"
          >
            {loading ? "Processing PDF..." : "Create FlashCards"}
          </button>
          <button
            disabled={!file || loading}
            onClick={handleUpload}
            className="mt-2 w-full rounded-2xl bg-yellow-400 py-4 text-white font-medium hover:bg-black disabled:bg-zinc-300 disabled:text-zinc-500 transition"
          >
            {loading ? "Processing PDF..." : "Summarize "}
          </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default UploadPDF;