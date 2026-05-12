import React from 'react';

const StreakCard = ({ streak = 0 }) => {
  return (
    <div className="bg-orange-100 p-4 rounded shadow text-center">
      <div className="text-3xl font-bold">🔥 {streak}</div>
      <div className="text-sm">Day Streak</div>
    </div>
  );
};

export default StreakCard;
