import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Smart Quiz System</h1>
      <p className="text-xl text-gray-600 mb-8">
        Test your knowledge with AI-generated quizzes
      </p>
      <Link to="/quizzes" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Start Learning
      </Link>
    </div>
  );
};

export default LandingPage;
