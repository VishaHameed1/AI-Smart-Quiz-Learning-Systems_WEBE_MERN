import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 60,
    difficulty: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/quizzes/create', quiz);
      
      // FIX: Added backticks and dynamic ID from the server response
      const quizId = response.data.data._id;
      navigate(`/teacher/quiz/${quizId}/questions`);
      
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
          <input
            type="text"
            placeholder="e.g. JavaScript Basics"
            value={quiz.title}
            onChange={(e) => setQuiz({...quiz, title: e.target.value})}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Describe what this quiz covers..."
            value={quiz.description}
            onChange={(e) => setQuiz({...quiz, description: e.target.value})}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
            <input
              type="number"
              value={quiz.duration}
              onChange={(e) => setQuiz({...quiz, duration: parseInt(e.target.value)})}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing %</label>
            <input
              type="number"
              value={quiz.passingScore}
              onChange={(e) => setQuiz({...quiz, passingScore: parseInt(e.target.value)})}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
          Create Quiz & Add Questions
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;