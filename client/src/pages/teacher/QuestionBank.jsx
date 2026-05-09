import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    if (topic) {
      axios.get(/api/questions/topic/)
        .then(res => setQuestions(res.data.data))
        .catch(err => console.error(err));
    }
  }, [topic]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Question Bank</h1>
      <input
        type="text"
        placeholder="Search by topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded mb-2">
          <p className="font-bold">{q.text}</p>
          <p className="text-sm text-gray-500">Topic: {q.topic} | Difficulty: {q.difficulty}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionBank;
