import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ReviewPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Spaced Repetition Review</h1>
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-600 mb-4">
          Welcome to your review queue, {user?.name || 'Student'}!
        </p>
        <p className="text-gray-500">
          Questions that need review will appear here based on the forgetting curve.
        </p>
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            🔄 No questions due for review right now. Great job!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;