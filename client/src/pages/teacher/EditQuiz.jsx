﻿import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // ✅ Fix: Import the missing hook
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    type: 'practice',
    duration: 30,
    passingScore: 60,
    difficulty: 'medium',
    instructions: '',
    isPublished: false,
    requiresEnrollment: false
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}`);
        if (res.data.success) {
          const quiz = res.data.data;
          
          // Security: Verify ownership (user.userId comes from AuthContext)
          if (quiz.createdBy._id !== user.userId && user.role !== 'admin') {
            toast.error("You are not authorized to edit this quiz");
            navigate('/teacher/quizzes');
            return;
          }
          
          setQuizData({
            title: quiz.title,
            description: quiz.description,
            type: quiz.type,
            duration: quiz.duration,
            passingScore: quiz.passingScore,
            difficulty: quiz.difficulty,
            instructions: quiz.instructions || '',
            isPublished: quiz.isPublished,
            requiresEnrollment: quiz.requiresEnrollment || false
          });
        }
      } catch (error) {
        toast.error("Failed to load quiz details");
        navigate('/teacher/quizzes');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchQuiz();
  }, [quizId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/quizzes/${quizId}`, quizData);
      if (res.data.success) {
        toast.success("Quiz updated successfully");
        navigate('/teacher/quizzes');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#030712] p-6 text-white">
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8">Edit Quiz Settings</h1>
        
        <GlassCard className="p-8" glowLine>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Title</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={quizData.description}
                onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={quizData.duration}
                  onChange={(e) => setQuizData({...quizData, duration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  value={quizData.passingScore}
                  onChange={(e) => setQuizData({...quizData, passingScore: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                  min="0" max="100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="isPublished"
                checked={quizData.isPublished}
                onChange={(e) => setQuizData({...quizData, isPublished: e.target.checked})}
                className="w-5 h-5 accent-cyan-500 cursor-pointer"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-300 cursor-pointer">
                Publish Quiz (Make visible to students)
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="requiresEnrollment"
                checked={quizData.requiresEnrollment}
                onChange={(e) => setQuizData({...quizData, requiresEnrollment: e.target.checked})}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="requiresEnrollment" className="text-sm font-medium text-slate-300 cursor-pointer">
                Requires Enrollment (Students must request access)
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <CyanButton type="submit" fullWidth glow disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Quiz Settings'}
              </CyanButton>
              <button
                type="button"
                onClick={() => navigate('/teacher/quizzes')}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default EditQuiz;