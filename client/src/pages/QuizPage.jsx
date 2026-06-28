import { useEffect, useState } from "react";
import { getQuiz } from "../api/backend";
import Quiz from "../components/Quiz";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await getQuiz();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, []);

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
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-500 text-lg animate-pulse">
          Generating your quiz...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-14 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="mb-10">
          <p className="text-blue-600 font-medium tracking-wide uppercase text-sm">
            PDF Prep
          </p>

          <h1 className="text-4xl font-bold text-zinc-900 mt-2">
            Knowledge Quiz
          </h1>

          <p className="text-zinc-500 mt-3">
            Answer all questions before submitting.
          </p>
        </div>

        {/* Quiz Card */}

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8">

          <Quiz
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />

        </div>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between">

          <div>
            <p className="text-zinc-500">
              {Object.keys(answers).length} / {questions.length} answered
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="
              bg-zinc-900
              hover:bg-black
              text-white
              px-8
              py-3
              rounded-xl
              font-medium
              transition
              duration-200
            "
          >
            Submit Quiz
          </button>

        </div>

        {/* Score */}

        {score !== null && (
          <div className="mt-10 rounded-3xl bg-white border border-zinc-200 shadow-sm p-8">

            <h2 className="text-xl font-semibold text-zinc-900">
              Quiz Completed 🎉
            </h2>

            <div className="mt-5 flex items-center justify-between">

              <div>
                <p className="text-zinc-500">
                  Final Score
                </p>

                <p className="text-5xl font-bold mt-1 text-zinc-900">
                  {score}
                  <span className="text-2xl text-zinc-400">
                    {" "}
                    / {questions.length}
                  </span>
                </p>
              </div>

              <div
                className={`
                  px-5
                  py-3
                  rounded-full
                  font-semibold
                  ${
                    score / questions.length >= 0.8
                      ? "bg-green-100 text-green-700"
                      : score / questions.length >= 0.5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {Math.round((score / questions.length) * 100)}%
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default QuizPage;