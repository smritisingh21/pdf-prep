import { useEffect, useState } from "react";
import { getQuiz } from "../api/backend";
import Quiz from "../components/Quiz";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    setLoading(true);

    try {
      const data = await getQuiz();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerChange(index, option) {
    setAnswers((prev) => ({
      ...prev,
      [index]: option,
    }));
  }

  function handleSubmit() {
    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    setScore(correct);
    setShowResult(true);
  }

  function handleRetry() {
    setAnswers({});
    setScore(null);
    setShowResult(false);
  }

  async function handleNextQuiz() {
    setShowResult(false);
    setAnswers({});
    setScore(null);
    await loadQuiz();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 mx-auto border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>

          <p className="mt-6 text-zinc-500 text-lg">
            Generating your quiz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen bg-zinc-50 py-14 px-6 transition-all duration-300 ${
          showResult ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto">

          {/* Header */}

          <div className="mb-12">
            <p className="text-blue-600 font-medium uppercase tracking-wider text-sm">
              PDF Prep
            </p>

            <h1 className="mt-2 text-5xl font-bold text-zinc-900">
              Knowledge Quiz
            </h1>

            <p className="mt-3 text-zinc-500 text-lg">
              Test your understanding of the uploaded PDF.
            </p>
          </div>

          {/* Progress */}

          <div className="mb-8 flex justify-between items-center">

            <span className="text-zinc-500">
              {Object.keys(answers).length} / {questions.length} answered
            </span>

            <div className="w-64 h-2 rounded-full bg-zinc-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    (Object.keys(answers).length / questions.length) * 100
                  }%`,
                }}
              />
            </div>

          </div>

          {/* Quiz */}

          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-10">

            <Quiz
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />

          </div>

          {/* Submit */}

          <div className="mt-10 flex justify-end">

            <button
              onClick={handleSubmit}
              className="bg-zinc-900 hover:bg-black text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Submit Quiz
            </button>

          </div>

        </div>
      </div>

      {/* Result Modal */}

      {showResult && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-6">

          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-10">

            <div className="text-center">

              <div className="text-6xl">
                🎉
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                Quiz Completed
              </h2>

              <p className="mt-2 text-zinc-500">
                Here's your result.
              </p>

            </div>

            {/* Score */}

            <div className="mt-10 text-center">

              <div className="text-6xl font-bold text-zinc-900">
                {score}
                <span className="text-3xl text-zinc-400">
                  /{questions.length}
                </span>
              </div>

              <div
                className={`mt-5 inline-flex px-5 py-2 rounded-full font-semibold ${
                  score / questions.length >= 0.8
                    ? "bg-green-100 text-green-700"
                    : score / questions.length >= 0.5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {Math.round((score / questions.length) * 100)}%
              </div>

            </div>

            {/* Stats */}

            <div className="mt-10 grid grid-cols-2 gap-4 text-center">

              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-zinc-500 text-sm">
                  Correct
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {score}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-zinc-500 text-sm">
                  Incorrect
                </p>

                <p className="text-2xl font-bold text-red-500">
                  {questions.length - score}
                </p>
              </div>

            </div>

            {/* Buttons */}

            <div className="mt-10 space-y-3">

              <button
                onClick={handleRetry}
                className="w-full border border-zinc-300 rounded-xl py-3 hover:bg-zinc-100 transition font-medium"
              >
                Repeat Quiz
              </button>

              <button
                onClick={handleNextQuiz}
                className="w-full bg-zinc-900 hover:bg-black text-white rounded-xl py-3 transition font-medium"
              >
                Generate Next Quiz
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default QuizPage;