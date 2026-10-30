import { useState } from "react";
import UploadPDF from "../components/UploadPDF";
import QuizPage from "./QuizPage";
import FlashcardsPage from "./FlashcardsPage";
import { BookOpen, HelpCircle, ArrowLeft } from "lucide-react";

function UploadPage() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState("quiz"); // "quiz" | "flashcards"

  function handleUploaded(selectedMode = "quiz") {
    setMode(selectedMode);
    setReady(true);
  }

  function handleReset() {
    setReady(false);
    setMode("quiz");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {!ready ? (
        <UploadPDF onUploaded={handleUploaded} />
      ) : (
        <div>
          {/* Top Sticky Study Mode Bar */}
          <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-xs md:text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition"
              >
                <ArrowLeft size={16} />
                Upload New Document
              </button>

              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMode("quiz")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition ${
                    mode === "quiz"
                      ? "bg-white text-zinc-900 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <HelpCircle
                    size={16}
                    className={mode === "quiz" ? "text-blue-600" : "text-zinc-400"}
                  />
                  Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setMode("flashcards")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition ${
                    mode === "flashcards"
                      ? "bg-white text-zinc-900 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <BookOpen
                    size={16}
                    className={
                      mode === "flashcards" ? "text-indigo-600" : "text-zinc-400"
                    }
                  />
                  Flashcards
                </button>
              </div>
            </div>
          </header>

          {/* Active View */}
          <main>
            {mode === "quiz" ? (
              <QuizPage
                onSwitchToFlashcards={() => setMode("flashcards")}
                onReset={handleReset}
              />
            ) : (
              <FlashcardsPage
                onSwitchToQuiz={() => setMode("quiz")}
                onReset={handleReset}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
