import React from 'react';

const ScoreCard = ({ score, total, percentage, passed }) => {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Your Score</h2>
      <p className="text-5xl font-bold text-blue-600 mb-2">{score} / {total}</p>
      <p className="text-xl mb-2">{percentage}%</p>
      <p className="text-lg font-bold">
        {passed ? '✅ You Passed!' : '❌ Try Again'}
      </p>
    </div>
  );
};

export default ScoreCard;
