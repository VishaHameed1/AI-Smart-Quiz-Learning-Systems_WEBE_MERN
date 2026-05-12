import React from 'react';

const ProgressOverview = ({ progress = {} }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Progress Overview</h3>
      <p>Topics mastered: {progress.mastered || 0}</p>
      <p>Questions answered: {progress.answered || 0}</p>
    </div>
  );
};

export default ProgressOverview;
