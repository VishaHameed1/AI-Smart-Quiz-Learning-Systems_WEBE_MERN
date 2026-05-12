import React from 'react';

const SkillGapAnalysis = ({ gaps = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Skill Gaps</h3>
      {gaps.map((gap, i) => (
        <div key={i} className="text-red-600">⚠️ {gap.topic}</div>
      ))}
    </div>
  );
};

export default SkillGapAnalysis;
