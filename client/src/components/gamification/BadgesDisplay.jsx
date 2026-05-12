import React from 'react';

const BadgesDisplay = ({ badges = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, i) => (
          <div key={i} className="bg-yellow-100 p-2 rounded">🎖️ {badge.name}</div>
        ))}
      </div>
    </div>
  );
};

export default BadgesDisplay;
