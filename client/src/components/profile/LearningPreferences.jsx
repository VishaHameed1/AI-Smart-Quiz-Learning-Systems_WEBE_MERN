import React from 'react';

const LearningPreferences = ({ preferences = {}, onUpdate }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Learning Preferences</h3>
      <select className="w-full border p-2 rounded">
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>
  );
};

export default LearningPreferences;
