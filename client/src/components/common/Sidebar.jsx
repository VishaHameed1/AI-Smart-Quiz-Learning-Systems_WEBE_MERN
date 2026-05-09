import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <ul className="space-y-2">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/quizzes">My Quizzes</Link></li>
        <li><Link to="/results">Results</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
