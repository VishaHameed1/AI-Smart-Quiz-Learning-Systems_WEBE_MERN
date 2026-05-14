import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Brain, Trophy, Filter } from 'lucide-react';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', difficulty: '', search: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      
      // ✅ Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/quizzes?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`/api/attempts/quiz/${quizId}/start`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      navigate(`/quiz/${quizId}/take/${response.data.data._id}`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'timed': return <Clock className="w-4 h-4" />;
      case 'adaptive': return <Brain className="w-4 h-4" />;
      case 'competitive': return <Trophy className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="glass-panel p-8">
          <h1 className="text-3xl font-semibold text-slate-950">Available Quizzes</h1>
          <p className="mt-3 text-slate-600">Challenge yourself with adaptive quizzes designed for your learning level.</p>
        </div>

        {/* Filters */}
        <div className="glass-panel p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filters:</span>
            </div>
            
            <select
              className="glass-input flex-1 min-w-[150px]"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="timed">Timed</option>
              <option value="practice">Practice</option>
              <option value="adaptive">Adaptive</option>
              <option value="competitive">Competitive</option>
            </select>
            
            <select
              className="glass-input flex-1 min-w-[150px]"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
            
            <input
              type="text"
              placeholder="Search quizzes..."
              className="glass-input flex-1 min-w-[150px]"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="glass-panel p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                  {getTypeIcon(quiz.type)}
                  {quiz.type.charAt(0).toUpperCase() + quiz.type.slice(1)}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{quiz.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{quiz.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span>📋 {quiz.totalQuestions} questions</span>
                <span>⏱️ {quiz.duration} min</span>
                <span>🎯 {quiz.passingScore}% to pass</span>
              </div>
              
              <button
                onClick={() => startQuiz(quiz._id)}
                className="glass-button mt-auto w-full text-center"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
        
        {quizzes.length === 0 && !loading && (
          <div className="glass-panel p-12 text-center">
            <p className="text-slate-600">No quizzes found. Check back later!</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;