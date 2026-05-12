import React from 'react';

const LevelProgress = ({ level = 1, xp = 0, nextLevelXp = 100 }) => {
  const progressPercent = (xp / nextLevelXp) * 100;
  const widthStyle = { width: progressPercent + '%' };
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-center">
        <div className="text-2xl font-bold">Level {level}</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={widthStyle}></div>
        </div>
        <div className="text-sm mt-1">{xp} / {nextLevelXp} XP</div>
      </div>
    </div>
  );
};

export default LevelProgress;
