import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import CyanButton from '../../components/common/CyanButton';

const AdminQuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/admin/quizzes');
        if (res.data.success) {
          setQuizzes(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz? All associated questions and attempts will be lost.")) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      toast.success("Quiz deleted successfully");
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete quiz");
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quiz.createdBy?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">📝 System Quizzes</h1>
          <p className="text-slate-400">Inventory of all quizzes across the platform.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/teacher/create-quiz">
            <CyanButton size="sm" glow>
              <Plus className="w-4 h-4 mr-2" /> Create Quiz
            </CyanButton>
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or email..."
              className="w-full sm:w-64 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-xl px-3">
            <span className="text-slate-400 text-xs uppercase font-bold">Difficulty:</span>
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-transparent py-2 text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Levels</option>
              <option value="easy" className="bg-slate-900">Easy</option>
              <option value="medium" className="bg-slate-900">Medium</option>
              <option value="hard" className="bg-slate-900">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-800/50 text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Quiz Title</th>
              <th className="px-6 py-4">Creator (Gmail)</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <tr key={quiz._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{quiz.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200">{quiz.createdBy?.name || 'System'}</span>
                      <span className="text-xs text-cyan-400 font-mono">{quiz.createdBy?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      quiz.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                      quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {quiz.difficulty || 'medium'}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 capitalize bg-slate-800/50 px-2 py-1 rounded-md">{quiz.type || 'Standard'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/teacher/quiz/${quiz._id}/questions`}
                          className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition"
                          title="Manage Questions"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link 
                          to={`/teacher/quiz/${quiz._id}/edit`}
                          className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition"
                          title="Edit Quiz"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(quiz._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                          title="Delete Quiz"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">No quizzes found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuizManagement;