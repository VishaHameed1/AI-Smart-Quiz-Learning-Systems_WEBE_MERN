import React from 'react';

const LeaderboardPreview = ({ leaders = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Leaderboard</h3>
      {leaders.slice(0, 5).map((user, i) => (
        <div key={i} className="flex justify-between py-1">
          <span>{i+1}. {user.name}</span>
          <span>{user.score} pts</span>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPreview;
