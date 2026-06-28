import React from "react";


function Quiz({ questions }) {
  return (
    <div>
      <h2>Answer these and test your knowledge</h2>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>
            {index + 1}. {q.question}
          </h3>

          {q.options.map((option, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={i}
                />
                {" "}
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Quiz;