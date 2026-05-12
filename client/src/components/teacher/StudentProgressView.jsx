import React from 'react';

const StudentProgressView = ({ studentId }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Student Progress</h3>
      <p>Showing progress for student ID: {studentId}</p>
    </div>
  );
};

export default StudentProgressView;
