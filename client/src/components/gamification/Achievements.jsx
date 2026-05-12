import React from 'react';

const Achievements = ({ achievements = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Achievements</h3>
      {achievements.map((ach, i) => (
        <div key={i} className="py-1">🏆 {ach.name}</div>
      ))}
    </div>
  );
};

export default Achievements;
