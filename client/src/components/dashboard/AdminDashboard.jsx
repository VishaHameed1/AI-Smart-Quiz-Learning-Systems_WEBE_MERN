import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Total Users: 0</div>
        <div className="bg-white p-4 rounded shadow">Total Quizzes: 0</div>
        <div className="bg-white p-4 rounded shadow">Total Attempts: 0</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
