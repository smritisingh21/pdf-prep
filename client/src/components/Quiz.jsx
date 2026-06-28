import React from "react";

function Quiz({ questions, answers, onAnswerChange }) {
  return (
    <div className="space-y-8">

      <div className="text-center mb-12">
        <p className="text-blue-600 font-medium uppercase tracking-wider text-sm">
          Knowledge Check
        </p>

        <h2 className="mt-3 text-4xl font-bold text-zinc-900">
          Test Your Understanding
        </h2>

        <p className="mt-3 text-zinc-500 text-lg">
          Choose the best answer for each question.
        </p>
      </div>

      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-zinc-900 mb-6 leading-relaxed">
            <span className="text-blue-600 mr-2">
              {index + 1}.
            </span>

            {q.question}
          </h3>

          <div className="space-y-4">

            {q.options.map((option, i) => (
              <label
                key={i}
                className="
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  border
                  border-zinc-200
                  hover:border-blue-300
                  hover:bg-blue-50
                  transition-all
                  duration-200
                  cursor-pointer
                "
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers?.[index] === option}
                  onChange={() => onAnswerChange(index, option)}
                  className="
                    h-5
                    w-5
                    accent-blue-600
                    cursor-pointer
                  "
                />

                <span className="text-zinc-700 text-base">
                  {option}
                </span>
              </label>
            ))}

          </div>
        </div>
      ))}
    </div>
  );
}

export default Quiz;