import React from 'react';

const ReviewCard = ({ question, onAnswer }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-2">
      <p className="font-bold">{question?.text}</p>
      <button onClick={() => onAnswer(true)} className="bg-green-500 text-white p-2 rounded mt-2 mr-2">Correct</button>
      <button onClick={() => onAnswer(false)} className="bg-red-500 text-white p-2 rounded mt-2">Incorrect</button>
    </div>
  );
};

export default ReviewCard;
