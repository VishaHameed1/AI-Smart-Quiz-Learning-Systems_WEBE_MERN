import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Brain, Trophy, Filter, Search } from 'lucide-react';
import { getAllQuizzes } from '../../services/quizService';
import { startQuiz as startQuizAttempt } from '../../services/attemptService';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
      const data = await getAllQuizzes(filters);
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const attempt = await startQuizAttempt(quizId);
      if (attempt && attempt._id) {
        navigate(`/quiz/${quizId}/take/${attempt._id}`);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Available Quizzes</h1>
          <p className="text-slate-400 mt-2">Test your knowledge with our interactive quizzes</p>
        </div>

        {/* Filters - Glass Style */}
        <GlassCard className="p-5 mb-6" glowLine>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Filters:</span>
            </div>
            
            <select
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50"
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
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
            
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </GlassCard>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <GlassCard key={quiz._id} className="p-6" hover3d glowLine>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1) || 'Medium'}
                </span>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  {getTypeIcon(quiz.type)}
                  <span className="capitalize">{quiz.type || 'Practice'}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{quiz.description || 'No description available'}</p>
              
              <div className="flex items-center justify-between text-sm text-slate-400 mb-5">
                <span>📋 {quiz.totalQuestions || 0} questions</span>
                <span>⏱️ {quiz.duration || 0} min</span>
                <span>🎯 {quiz.passingScore || 60}% to pass</span>
              </div>
              
              <CyanButton onClick={() => handleStartQuiz(quiz._id)} fullWidth size="sm" glow>
                Start Quiz
              </CyanButton>
            </GlassCard>
          ))}
        </div>
        
        {quizzes.length === 0 && (
          <GlassCard className="text-center py-12">
            <p className="text-slate-400">No quizzes found. Check back later!</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default QuizList;