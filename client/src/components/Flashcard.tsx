import React from "react";
import { RotateCw, CheckCircle2, HelpCircle, Sparkles } from "lucide-react";

interface FlashcardProps {
  card: {
    front: string;
    back: string;
  };
  index: number;
  total: number;
  isFlipped: boolean;
  onFlip: () => void;
  status?: "mastered" | "learning" | "unseen";
  onMarkStatus?: (status: "mastered" | "learning") => void;
  isGrid?: boolean;
}

export default function Flashcard({
  card,
  index,
  total,
  isFlipped,
  onFlip,
  status = "unseen",
  onMarkStatus,
  isGrid = false,
}: FlashcardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip();
    }
  }

  return (
    <div
      className={`perspective-1000 w-full select-none ${
        isGrid ? "h-72" : "h-96 max-w-2xl mx-auto"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${index + 1} of ${total}. Click to flip. Current side: ${
          isFlipped ? "Answer" : "Question"
        }`}
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        className={`relative w-full h-full transform-style-3d transition-transform duration-500 ease-out cursor-pointer rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT FACE (QUESTION) */}
        <div className="absolute inset-0 backface-hidden w-full h-full bg-white border border-zinc-200/90 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between interactive-card">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200/50 flex items-center gap-1.5">
                <HelpCircle size={13} /> Question
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                {index + 1} / {total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {status === "mastered" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Mastered
                </span>
              )}
              {status === "learning" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  Learning
                </span>
              )}
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <RotateCw size={12} /> Flip
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="my-auto py-4">
            <p
              className={`font-semibold text-zinc-900 leading-relaxed ${
                isGrid ? "text-lg line-clamp-4" : "text-2xl md:text-3xl"
              }`}
            >
              {card.front}
            </p>
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs text-zinc-400">
            <span>Click anywhere to flip</span>
            <span className="hidden sm:inline">Space / Enter</span>
          </div>
        </div>

        {/* BACK FACE (ANSWER) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-200/70 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between interactive-card">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
                <Sparkles size={13} /> Answer
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                {index + 1} / {total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <RotateCw size={12} /> Flip back
              </span>
            </div>
          </div>

          {/* Answer Text */}
          <div className="my-auto py-4 overflow-y-auto max-h-48 pr-2">
            <p
              className={`font-normal text-zinc-800 leading-relaxed ${
                isGrid ? "text-base line-clamp-5" : "text-xl md:text-2xl"
              }`}
            >
              {card.back}
            </p>
          </div>

          {/* Actions & Status on Back */}
          <div
            className="flex items-center justify-between pt-4 border-t border-indigo-100/70"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-zinc-400">How did you do?</div>

            {onMarkStatus && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onMarkStatus("learning")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    status === "learning"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
                  }`}
                >
                  Still Learning
                </button>
                <button
                  type="button"
                  onClick={() => onMarkStatus("mastered")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                    status === "mastered"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
                  }`}
                >
                  <CheckCircle2 size={13} /> Mastered
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
