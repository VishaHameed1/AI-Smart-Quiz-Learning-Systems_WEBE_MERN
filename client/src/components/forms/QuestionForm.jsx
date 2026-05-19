import React, { useState } from 'react';

const QuestionForm = ({ onSubmit }) => {
  const [question, setQuestion] = useState({
    text: '',
    topic: '',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    points: 10,
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
      <div className="grid gap-3 md:grid-cols-2">
        {question.options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => {
              const newOptions = [...question.options];
              newOptions[idx] = e.target.value;
              setQuestion({ ...question, options: newOptions });
            }}
            className="w-full border p-2 rounded"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Topic"
          value={question.topic}
          onChange={(e) => setQuestion({ ...question, topic: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <select
          value={question.difficulty}
          onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Correct answer"
        value={question.correctAnswer}
        onChange={(e) => setQuestion({ ...question, correctAnswer: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Explanation"
        value={question.explanation}
        onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
        className="w-full border p-2 rounded"
        rows={3}
      />
      <input
        type="number"
        placeholder="Points"
        value={question.points}
        min={1}
        onChange={(e) => setQuestion({ ...question, points: Number(e.target.value) })}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Question
      </button>
    </form>
  );
};

export default QuestionForm;
