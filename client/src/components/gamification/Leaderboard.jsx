import React from 'react';

const Leaderboard = ({ users = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Leaderboard</h3>
      {users.map((user, i) => (
        <div key={i} className="flex justify-between py-1 border-b">
          <span>{i+1}. {user.name}</span>
          <span>{user.points} pts</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
