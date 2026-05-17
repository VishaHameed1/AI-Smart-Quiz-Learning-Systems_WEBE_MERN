import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teacherService from '../../services/teacherService';
import api from '../../services/api';

const TeacherQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await teacherService.getQuizzes();
        setQuizzes(res.data.data || []);
      } catch (err) {
        console.error(err);
        setStatus('Unable to load quizzes.');
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const removeQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz? This cannot be undone.')) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
      setStatus('Quiz deleted successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Failed to delete quiz.');
    }
  };

  const duplicateQuiz = async (quizId) => {
    try {
      const res = await api.post(`/quizzes/${quizId}/duplicate`);
      setQuizzes((prev) => [res.data.data, ...prev]);
      setStatus('Quiz duplicated successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Failed to duplicate quiz.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">My Quizzes</h1>
          <p className="text-slate-400">Manage your created quizzes, edit content, or add questions.</p>
        </div>
        <button
          onClick={() => navigate('/teacher/create-quiz')}
          className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
        >
          Create New Quiz
        </button>
      </div>
      {status && <div className="mb-4 rounded-xl bg-slate-900 p-4 text-slate-200">{status}</div>}
      {loading ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">Loading your quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">No quizzes found. Create one to start adding questions.</div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="glass-card p-6 rounded-xl border border-white/10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{quiz.title}</h2>
                  <p className="text-slate-400">{quiz.description}</p>
                  <div className="mt-2 text-sm text-slate-500">Questions: {quiz.totalQuestions ?? 0} · Difficulty: {quiz.difficulty} · Duration: {quiz.duration} min</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/teacher/quiz/${quiz._id}/questions`)}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => navigate(`/teacher/quiz/${quiz._id}/edit`)}
                    className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => duplicateQuiz(quiz._id)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => removeQuiz(quiz._id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherQuizzes;
