import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">AI Quiz System</Link>
        <div className="space-x-4">
          <Link to="/quizzes">Quizzes</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
