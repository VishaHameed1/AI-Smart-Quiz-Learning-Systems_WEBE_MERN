import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const QuizHistory = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    api.get('/attempts/user/my-attempts')
      .then((res) => setAttempts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Quiz History</h1>
      {attempts.map(attempt => (
        <div key={attempt._id} className="border p-4 rounded mb-2">
          <p>Score: {attempt.percentageScore}%</p>
          <p>Date: {new Date(attempt.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default QuizHistory;
