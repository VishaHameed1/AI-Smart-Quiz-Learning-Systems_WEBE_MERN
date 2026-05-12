import React from 'react';

const ReviewStats = ({ stats = {} }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Review Stats</h3>
      <p>Completed: {stats.completed || 0}</p>
      <p>Retention rate: {stats.retention || 0}%</p>
    </div>
  );
};

export default ReviewStats;
