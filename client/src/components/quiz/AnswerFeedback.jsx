import React from 'react';

const AnswerFeedback = ({ isCorrect, explanation, correctAnswer }) => {
  return (
    <div className={p-4 rounded-lg }>
      <p className="font-bold">{isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</p>
      <p className="mt-2">{explanation}</p>
      {!isCorrect && (
        <p className="mt-2 text-green-600">Correct answer: {correctAnswer}</p>
      )}
    </div>
  );
};

export default AnswerFeedback;
