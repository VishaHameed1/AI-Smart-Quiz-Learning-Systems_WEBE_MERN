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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <p className="text-gray-600 mt-2">Test your knowledge with our interactive quizzes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select
            className="border rounded-lg px-3 py-2 text-sm"
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
            className="border rounded-lg px-3 py-2 text-sm"
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
            className="border rounded-lg px-3 py-2 text-sm flex-1 max-w-xs"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  {getTypeIcon(quiz.type)}
                  <span>{quiz.type.charAt(0).toUpperCase() + quiz.type.slice(1)}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>📋 {quiz.totalQuestions} questions</span>
                <span>⏱️ {quiz.duration} min</span>
                <span>🎯 {quiz.passingScore}% to pass</span>
              </div>
              
              <button
                onClick={() => startQuiz(quiz._id)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No quizzes found. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default QuizList;