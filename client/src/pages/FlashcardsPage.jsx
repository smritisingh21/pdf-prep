import { useEffect, useState, useCallback } from "react";
import { getFlashcards } from "../api/backend";
import Flashcard from "../components/Flashcard";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  Grid,
  CreditCard,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function FlashcardsPage({ onSwitchToQuiz, onReset }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("deck"); // "deck" | "grid"
  const [statuses, setStatuses] = useState({}); // { [index]: "mastered" | "learning" }
  const [gridFlipped, setGridFlipped] = useState({}); // { [index]: boolean }
  const [gridFilter, setGridFilter] = useState("all"); // "all" | "mastered" | "learning"
  const [showCompletion, setShowCompletion] = useState(false);

  const loadFlashcards = useCallback(async (query) => {
    setLoading(true);
    setError("");
    setShowCompletion(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
    setGridFlipped({});

    try {
      const data = await getFlashcards(query);
      const cards = data.flashcards || [];
      if (!cards.length) {
        throw new Error("No flashcards could be generated from this document.");
      }
      setFlashcards(cards);
    } catch (err) {
      console.error("Failed to load flashcards:", err);
      setError(err.message || "Failed to load flashcards.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!flashcards.length) return;
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowCompletion(true);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleToggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleMarkStatus = useCallback(
    (status) => {
      setStatuses((prev) => ({
        ...prev,
        [currentIndex]: status,
      }));
      // Auto advance to next card after marking
      setTimeout(() => {
        handleNext();
      }, 250);
    },
    [currentIndex, handleNext]
  );

  const handleShuffle = () => {
    const shuffled = [...flashcards]
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
    setGridFlipped({});
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
    setShowCompletion(false);
  };

  // Keyboard navigation for deck view
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't trigger if user is in an input or modal
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (viewMode !== "deck" || showCompletion || loading) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        handleToggleFlip();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        handleMarkStatus("mastered");
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleMarkStatus("learning");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, showCompletion, loading, handleNext, handlePrev, handleToggleFlip, handleMarkStatus]);

  // Statistics
  const masteredCount = Object.values(statuses).filter((s) => s === "mastered").length;
  const learningCount = Object.values(statuses).filter((s) => s === "learning").length;
  const progressPercent = flashcards.length
    ? Math.round(((currentIndex + 1) / flashcards.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-2xl border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <BookOpen className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-zinc-900">Generating Flashcards</h3>
          <p className="mt-2 text-zinc-500 text-sm leading-relaxed">
            LangChain & Ollama are extracting core principles, definitions, and questions from your PDF...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Could Not Generate Flashcards</h3>
          <p className="mt-2 text-zinc-500 text-sm">{error}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => loadFlashcards()}
              className="flex-1 bg-zinc-900 hover:bg-black text-white py-3 rounded-xl font-semibold transition"
            >
              Try Again
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="flex-1 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 py-3 rounded-xl font-medium transition"
              >
                Upload New PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  // Filter cards for grid view
  const filteredGridCards = flashcards
    .map((card, idx) => ({ card, idx }))
    .filter(({ idx }) => {
      if (gridFilter === "mastered") return statuses[idx] === "mastered";
      if (gridFilter === "learning") return statuses[idx] === "learning";
      return true;
    });

  return (
    <div className="min-h-screen py-10 px-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Sparkles size={14} /> AI-Generated Study Material
          </div>
          <h1 className="mt-1 text-4xl font-bold text-zinc-900">Study Flashcards</h1>
          <p className="mt-1 text-zinc-500 text-base">
            Master concepts through active recall and spaced repetition.
          </p>
        </div>

        {/* Top Badges & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Mastery stats */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-2 text-xs shadow-sm">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 size={13} /> {masteredCount} Mastered
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-amber-700 font-semibold">
              {learningCount} Learning
            </span>
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500 font-medium">
              {flashcards.length} Total
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode("deck")}
              title="Deck View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === "deck"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <CreditCard size={14} /> Deck
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === "grid"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Grid size={14} /> Grid
            </button>
          </div>

          {onSwitchToQuiz && (
            <button
              onClick={onSwitchToQuiz}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white transition shadow-sm"
            >
              Take Quiz <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* DECK VIEW */}
      {/* ========================================================= */}
      {viewMode === "deck" && currentCard && (
        <div className="space-y-6">
          {/* Progress Bar & Actions */}
          <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
            <span>
              Card <strong className="text-zinc-900">{currentIndex + 1}</strong> of{" "}
              {flashcards.length}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition"
              >
                <Shuffle size={13} /> Shuffle
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition"
              >
                <RefreshCw size={13} /> Reset
              </button>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Central 3D Flashcard */}
          <div className="py-4">
            <Flashcard
              card={currentCard}
              index={currentIndex}
              total={flashcards.length}
              isFlipped={isFlipped}
              onFlip={handleToggleFlip}
              status={statuses[currentIndex] || "unseen"}
              onMarkStatus={handleMarkStatus}
            />
          </div>

          {/* Navigation & Action Controls */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 font-medium transition text-sm shadow-sm"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <button
                onClick={handleToggleFlip}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-semibold transition text-sm shadow-sm"
              >
                <RotateCw size={16} /> Flip Card
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-700 font-medium transition text-sm shadow-sm"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>

            {/* Quick Rating Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkStatus("learning")}
                className={`px-4 py-3 rounded-2xl text-xs font-semibold transition border ${
                  statuses[currentIndex] === "learning"
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : "bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100"
                }`}
              >
                Still Learning (L)
              </button>
              <button
                onClick={() => handleMarkStatus("mastered")}
                className={`px-4 py-3 rounded-2xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                  statuses[currentIndex] === "mastered"
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                    : "bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <CheckCircle2 size={14} /> Mastered (M)
              </button>
            </div>
          </div>

          {/* Keyboard tip */}
          <div className="text-center pt-2">
            <span className="text-xs text-zinc-400 bg-zinc-100/80 px-3 py-1.5 rounded-full inline-block">
              ⌨️ Keyboard shortcuts: <strong>←</strong> / <strong>→</strong> navigate,{" "}
              <strong>Space</strong> flip, <strong>M</strong> master, <strong>L</strong> learn
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GRID VIEW */}
      {/* ========================================================= */}
      {viewMode === "grid" && (
        <div className="space-y-6">
          {/* Grid Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGridFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  gridFilter === "all"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                All Cards ({flashcards.length})
              </button>
              <button
                onClick={() => setGridFilter("mastered")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  gridFilter === "mastered"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Mastered ({masteredCount})
              </button>
              <button
                onClick={() => setGridFilter("learning")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  gridFilter === "learning"
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Still Learning ({learningCount})
              </button>
            </div>

            <button
              onClick={() => {
                const allFlipped = Object.values(gridFlipped).filter(Boolean).length === flashcards.length;
                const newFlipped = {};
                flashcards.forEach((_, i) => {
                  newFlipped[i] = !allFlipped;
                });
                setGridFlipped(newFlipped);
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition"
            >
              <RotateCw size={13} /> Flip All
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGridCards.map(({ card, idx }) => (
              <Flashcard
                key={idx}
                card={card}
                index={idx}
                total={flashcards.length}
                isFlipped={Boolean(gridFlipped[idx])}
                onFlip={() =>
                  setGridFlipped((prev) => ({
                    ...prev,
                    [idx]: !prev[idx],
                  }))
                }
                status={statuses[idx] || "unseen"}
                onMarkStatus={(st) =>
                  setStatuses((prev) => ({
                    ...prev,
                    [idx]: st,
                  }))
                }
                isGrid={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* COMPLETION MODAL */}
      {/* ========================================================= */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8 text-center animate-in fade-in duration-200">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-zinc-900">Deck Complete!</h2>
            <p className="mt-2 text-zinc-500 text-sm">
              You reviewed all {flashcards.length} flashcards in this deck.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                  Mastered
                </p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{masteredCount}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-amber-800 text-xs font-semibold uppercase tracking-wider">
                  Need Review
                </p>
                <p className="text-3xl font-bold text-amber-800 mt-1">{learningCount}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-zinc-900 hover:bg-black text-white rounded-xl py-3 font-semibold transition"
              >
                Review Deck Again
              </button>
              {onSwitchToQuiz && (
                <button
                  onClick={onSwitchToQuiz}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2"
                >
                  Test Knowledge with Quiz <ArrowRight size={16} />
                </button>
              )}
              {onReset && (
                <button
                  onClick={onReset}
                  className="w-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl py-3 font-medium transition"
                >
                  Upload Another PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
