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

  if (loading) return <p>Generating quiz...</p>;

  return (
    <div>
      <Quiz
        questions={questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />

      <button onClick={handleSubmit}>
        Submit Test
      </button>

      {score !== null && (
        <h2>
          Score: {score} / {questions.length}
        </h2>
      )}
    </div>
  );
}

export default QuizPage;