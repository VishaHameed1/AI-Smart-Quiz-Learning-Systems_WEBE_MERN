import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Clock, Brain, Trophy, Filter, Search, Folder as FolderIcon } from 'lucide-react';
import { getAllQuizzes } from '../../services/quizService';
import { startQuiz as startQuizAttempt } from '../../services/attemptService';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folderRequestStatus, setFolderRequestStatus] = useState({}); // To track pending folder requests
  const [filters, setFilters] = useState({ type: '', difficulty: '', search: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const [quizRes, folderRes, enrollRes] = await Promise.all([
        getAllQuizzes(filters),
        api.get('/student/folders'),
        api.get('/student/enrollments/my-requests')
      ]);
      setQuizzes(quizRes || []);
      setFolders(folderRes.data.data || []);
      
      const enrollMap = {};
      (enrollRes.data.data || []).forEach(e => {
        enrollMap[e.quiz._id || e.quiz] = e.status;
      });
      setEnrollments(enrollMap);

      const initialFolderRequestStatus = {};
      (folderRes.data.data || []).forEach(f => {
        initialFolderRequestStatus[f._id] = f.hasPendingRequest ? 'pending' : 'none';
      });
      setFolderRequestStatus(initialFolderRequestStatus);
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
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleEnrollRequest = async (quizId) => {
    try {
      const res = await api.post(`/quizzes/${quizId}/request-access`);
      if (res.data.success) {
        toast.success("Enrollment request sent!");
        setEnrollments(prev => ({ ...prev, [quizId]: 'pending' }));
        fetchQuizzes(); // Refresh list to update button state
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const handleRequestFolderAccess = async (folderId) => {
    try {
      setFolderRequestStatus(prev => ({ ...prev, [folderId]: 'sending' }));
      const res = await api.post(`/student/folders/${folderId}/request-access`);
      if (res.data.success) {
        toast.success("Folder access request sent!");
        setFolderRequestStatus(prev => ({ ...prev, [folderId]: 'pending' }));
        fetchQuizzes(); // Re-fetch to update folder status
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send folder access request");
      setFolderRequestStatus(prev => ({ ...prev, [folderId]: 'none' }));
    }
  };

  const handleCancelFolderAccess = async (folderId) => {
    try {
      setFolderRequestStatus(prev => ({ ...prev, [folderId]: 'sending' }));
      const res = await api.delete(`/student/folders/${folderId}/cancel-request`);
      if (res.data.success) {
        toast.success("Folder access request cancelled");
        setFolderRequestStatus(prev => ({ ...prev, [folderId]: 'none' }));
        fetchQuizzes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
      setFolderRequestStatus(prev => ({ ...prev, [folderId]: 'pending' }));
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
          <h1 className="text-4xl font-bold text-white">Available Content Folders</h1>
          <p className="text-slate-400 mt-2">Browse teacher folders and discover new quizzes.</p>
        </div>

        {/* Top Section: Folders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {folders.map(folder => (
              <Link key={folder._id} to={`/quizzes/folder/${folder._id}`}>
                <GlassCard className="p-6 cursor-pointer hover:border-cyan-500/50 transition-all group h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <FolderIcon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 py-1 bg-white/5 rounded">
                      {folder.quizzes?.length || 0} Quizzes
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{folder.name}</h2>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">{folder.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-[11px] text-slate-500 font-mono">By: {folder.createdBy?.email}</span>
                    <span className="text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">View Folder →</span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        
        {folders.length === 0 && (
          <GlassCard className="text-center py-12">
            <p className="text-slate-400">No quizzes found. Check back later!</p>
          </GlassCard>
        )}

        <hr className="my-16 border-white/5" />

        {/* Bottom Section: All Available Quizzes */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">All Available Quizzes</h1>
          <p className="text-slate-400 mt-2">Test your knowledge with our individual assessments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <QuizItem 
              key={quiz._id} 
              quiz={quiz} 
              enrollments={enrollments} 
              onStart={handleStartQuiz} 
              onEnroll={handleEnrollRequest} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizItem = ({ quiz, enrollments, onStart, onEnroll }) => {
  // Backend aggregated access or local fallback
  const status = quiz.enrollmentStatus || enrollments[quiz._id];
  const hasAccess = quiz.hasAccess ?? (!quiz.requiresEnrollment || status === 'accepted');
  const isPending = quiz.isPending ?? (status === 'pending');
  
  // Competitive quizzes can only be taken once
  const alreadyTaken = quiz.type === 'competitive' && quiz.isCompleted;

  return (
    <GlassCard className="flex flex-col h-full group" glowLine>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">{quiz.title}</h3>
          <div className="flex gap-2">
            {quiz.type === 'competitive' && <span className="text-[10px] font-bold uppercase px-2 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded">Competitive</span>}
            {quiz.requiresEnrollment && (
            <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">Private</span>
            )}
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{quiz.description}</p>
        <span className="text-[11px] text-slate-500 font-mono mb-6 block">By: {quiz.createdBy?.email || 'System'}</span>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        {alreadyTaken ? (
          <button disabled className="w-full py-3 text-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20 cursor-not-allowed">
            Completed (1/1 Attempt Used)
          </button>
        ) : hasAccess ? (
          <CyanButton onClick={() => onStart(quiz._id)} fullWidth glow>Start Quiz</CyanButton>
        ) : isPending ? (
          <button disabled className="w-full py-3 text-center rounded-full bg-slate-800 text-slate-500 font-bold text-sm border border-white/5 cursor-not-allowed">
            Pending Approval
          </button>
        ) : (
          <CyanButton onClick={() => onEnroll(quiz._id)} fullWidth glow>Request Access</CyanButton>
        )}
      </div>
    </GlassCard>
  );
};

export default QuizList;