import { useEffect, useState } from "react";
import { getQuiz } from "../api/backend";
import Quiz from "../components/Quiz";

function QuizPage() {
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    async function loadQuiz() {
      const data = await getQuiz();
      setQuiz(data);
    }

    loadQuiz();
  }, []);

  if (!quiz) return <p>Generating quiz...</p>;

  return <Quiz questions={quiz} />;
}

export default QuizPage;
