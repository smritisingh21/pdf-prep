import { useEffect, useState } from "react";
import { getQuiz } from "../api/backend";
import Quiz from "../components/Quiz";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await getQuiz();

        console.log("Quiz API Response:", data);

        // Store only the questions array
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Failed to load quiz:", error);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, []);

  if (loading) {
    return <p>Generating quiz...</p>;
  }

  if (questions.length === 0) {
    return <p>No questions found.</p>;
  }

  return <Quiz questions={questions} />;
}

export default QuizPage;