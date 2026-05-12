import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user, token } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || 'Student'}!</h2>
        <p className="text-gray-600 mb-2">Email: {user?.email}</p>
        <p className="text-gray-600 mb-4">Role: {user?.role || 'student'}</p>
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Quick Stats</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Total Quizzes Taken: 0</li>
            <li>• Average Score: 0%</li>
            <li>• Current Streak: 0 days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;