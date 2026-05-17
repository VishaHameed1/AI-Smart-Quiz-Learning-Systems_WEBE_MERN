import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then((res) => setQuiz(res.data.data))
      .catch((err) => console.error(err));
  }, [quizId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/quizzes/${quizId}`, quiz);
    navigate(`/teacher/quiz/${quizId}/questions`);
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => setQuiz({...quiz, title: e.target.value})}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;
