import { useState } from "react";
import { UploadCloud, FileText, HelpCircle, BookOpen, Sparkles } from "lucide-react";
import uploadPDF from "../api/backend";

function UploadPDF({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [error, setError] = useState("");

  async function handleUpload(mode = "quiz") {
    if (!file) return;

    setLoading(true);
    setActiveAction(mode);
    setError("");

    try {
      await uploadPDF(file);
      onUploaded(mode);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
      setActiveAction("");
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] min-w-full">
      <main className="max-w-5xl mx-auto px-8 pt-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-4 tracking-wide uppercase">
            <Sparkles size={13} /> AI Study Assistant
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight">
            Learning accelerated with AI
          </h1>

          <p className="mt-5 text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Upload lecture notes, research papers, or textbooks to instantly
            generate interactive quizzes, study flashcards, and key summaries.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mt-16">
          <label className="group cursor-pointer block">
            <div className="border-2 border-dashed border-zinc-300 rounded-3xl bg-white hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 shadow-sm">
              <div className="py-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-200">
                  <UploadCloud
                    className="text-zinc-500 group-hover:text-blue-600 transition"
                    size={36}
                    strokeWidth={1.8}
                  />
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-zinc-900">
                  Drop your PDF here
                </h2>

                <p className="mt-2 text-zinc-500 text-sm">
                  or click anywhere to browse from your computer
                </p>

                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setError("");
                    }
                  }}
                />
              </div>
            </div>
          </label>

          {file && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between shadow-sm animate-in fade-in duration-150">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>

                <div>
                  <p className="font-semibold text-zinc-900">{file.name}</p>
                  <p className="text-xs text-zinc-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-zinc-400 hover:text-red-600 font-medium px-2 py-1 transition"
              >
                Remove
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-600 text-sm flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-40">
            <button
              disabled={!file || loading}
              onClick={() => handleUpload("quiz")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 px-6 text-white font-semibold hover:bg-black disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition shadow-sm"
            >
              <HelpCircle size={18} />
              {loading && activeAction === "quiz"
                ? "Processing PDF..."
                : "Generate Quiz"}
            </button>

            <button
              disabled={!file || loading}
              onClick={() => handleUpload("flashcards")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 px-6 text-white font-semibold hover:bg-indigo-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition shadow-sm"
            >
              <BookOpen size={18} />
              {loading && activeAction === "flashcards"
                ? "Processing PDF..."
                : "Create Flashcards"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UploadPDF;