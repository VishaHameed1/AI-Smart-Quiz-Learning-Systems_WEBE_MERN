import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <ul>
        <li className="mb-2"><a href="/dashboard">Dashboard</a></li>
        <li className="mb-2"><a href="/quizzes">Quizzes</a></li>
        <li className="mb-2"><a href="/progress">Progress</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
