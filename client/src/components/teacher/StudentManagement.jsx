import React from 'react';

const StudentManagement = ({ students = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Student Management</h3>
      {students.map((student, i) => (
        <div key={i} className="flex justify-between py-1 border-b">
          <span>{student.name}</span>
          <button className="text-blue-600">View</button>
        </div>
      ))}
    </div>
  );
};

export default StudentManagement;
