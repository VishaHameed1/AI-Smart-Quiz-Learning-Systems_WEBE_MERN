import React, { useState } from 'react';

const QuestionForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(question);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Question Text"
        value={question.text}
        onChange={(e) => setQuestion({...question, text: e.target.value})}
        className="w-full border p-2 rounded"
      />
      {question.options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={Option }
          value={opt}
          onChange={(e) => {
            const newOptions = [...question.options];
            newOptions[idx] = e.target.value;
            setQuestion({...question, options: newOptions});
          }}
          className="w-full border p-2 rounded"
        />
      ))}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Question
      </button>
    </form>
  );
};

export default QuestionForm;
