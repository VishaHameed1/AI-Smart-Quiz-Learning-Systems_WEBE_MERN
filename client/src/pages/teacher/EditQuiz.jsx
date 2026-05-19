import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!quiz) return <div className="text-center py-8">Quiz not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={quiz.title || ''}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={quiz.description || ''}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            className="w-full border rounded-lg p-2"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={quiz.duration || 30}
            onChange={(e) => setQuiz({ ...quiz, duration: parseInt(e.target.value) })}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;