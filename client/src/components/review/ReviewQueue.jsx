import React from 'react';

const ReviewQueue = ({ reviews = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Review Queue</h3>
      <p>{reviews.length} items due for review</p>
    </div>
  );
};

export default ReviewQueue;
