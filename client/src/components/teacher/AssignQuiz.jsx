import React from 'react';

const AssignQuiz = ({ quizId, onAssign }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Assign Quiz</h3>
      <button onClick={() => onAssign(quizId)} className="bg-blue-600 text-white p-2 rounded">Assign to Class</button>
    </div>
  );
};

export default AssignQuiz;
