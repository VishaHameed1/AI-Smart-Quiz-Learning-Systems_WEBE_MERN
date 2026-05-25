import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChevronLeft, Lock, Play, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { startQuiz as startQuizAttempt } from '../../services/attemptService';

const FolderDetail = () => {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFolderDetails = async () => {
    try {
      const res = await api.get(`/student/folders/${folderId}`);
      setFolder(res.data.data);
    } catch (error) {
      toast.error("Failed to load folder contents");
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFolderDetails(); }, [folderId]);

  const handleRequestAccess = async (quizId) => {
    try {
      await api.post(`/student/enrollments/request`, { quizId });
      toast.success("Request sent to teacher");
      fetchFolderDetails(); // Refresh to show 'Pending'
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const attempt = await startQuizAttempt(quizId);
      if (attempt?._id) navigate(`/quiz/${quizId}/take/${attempt._id}`);
    } catch (error) {
      toast.error("Could not start quiz");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <button onClick={() => navigate('/quizzes')} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors">
        <ChevronLeft size={20} /> Back to Folders
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2">📁 {folder.name}</h1>
        <p className="text-slate-400 max-w-2xl">{folder.description}</p>
        <div className="flex gap-4 mt-4 text-xs font-mono text-cyan-500/80">
          <span>BY: {folder.createdBy?.email}</span>
          <span>•</span>
          <span>{folder.quizzes?.length || 0} TOTAL QUIZZES</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folder.quizzes.map((quiz) => {
          const alreadyAttempted = quiz.type === 'competitive' && quiz.isCompleted;
          const duration = quiz.duration || (quiz.totalQuestions || 0); // 1 Mark/Question = 1 Minute

          return (
            <GlassCard key={quiz._id} className="flex flex-col h-full border-white/5 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${quiz.type === 'competitive' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {quiz.type}
                </span>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Clock size={12} /> {duration} Mins
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
              <p className="text-slate-400 text-sm flex-1 line-clamp-2 mb-6">{quiz.description}</p>

              <div className="mt-auto">
                {alreadyAttempted ? (
                  <div className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold border border-emerald-500/20">
                    <CheckCircle size={18} /> Completed
                  </div>
                ) : quiz.isAuthorized ? (
                  <CyanButton onClick={() => handleStartQuiz(quiz._id)} fullWidth glow>
                    <Play size={16} className="mr-2 fill-current" /> Start Quiz
                  </CyanButton>
                ) : quiz.enrollmentStatus === 'pending' ? (
                  <div className="w-full py-3 text-center bg-amber-500/10 text-amber-500 rounded-xl font-bold border border-amber-500/20">
                    Pending Approval...
                  </div>
                ) : (
                  <button onClick={() => handleRequestAccess(quiz._id)} className="w-full py-3 bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-xl font-bold border border-white/10 flex items-center justify-center gap-2 transition-all">
                    <Lock size={16} /> Request Access
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default FolderDetail;