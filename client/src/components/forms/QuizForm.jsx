import React, { useState } from 'react';

const QuizForm = ({ onSubmit }) => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 60,
    difficulty: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quiz);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Quiz Title"
        value={quiz.title}
        onChange={(e) => setQuiz({...quiz, title: e.target.value})}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={quiz.description}
        onChange={(e) => setQuiz({...quiz, description: e.target.value})}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Quiz
      </button>
    </form>
  );
};

export default QuizForm;
