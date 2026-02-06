import React from "react";

function Quiz({ questions }) {
  return (
    <div>
      <h2>Quiz</h2>

      {questions.map((q, index) => (
        <div key={index}>
          <p>{q.question}</p>

          {q.options.map((opt, i) => (
            <div key={i}>
              <input type="radio" name={`q-${index}`} />
              <label>{opt}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Quiz;
