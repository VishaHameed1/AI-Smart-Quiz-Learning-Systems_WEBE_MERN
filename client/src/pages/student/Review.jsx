import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Review = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchQueue(); 
    fetchStats(); 
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/review/due');
      setQueue(res.data.data || []);
    } catch (err) { 
      console.error('Failed to load review queue', err); 
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/review/stats');
      setStats(res.data.data);
    } catch (err) { 
      console.error('Failed to load stats', err); 
    }
  };

  const submitQuality = async (quality) => {
    if (!queue[index] || submitting) return;
    setSubmitting(true);
    
    try {
      await api.post(`/review/${queue[index]._id}/submit`, { quality });
      const nextIndex = index + 1;
      if (nextIndex < queue.length) {
        setIndex(nextIndex);
      } else {
        alert('🎉 Review session complete! Great job!');
        navigate('/dashboard');
      }
      fetchStats();
    } catch (err) { 
      console.error('Submit review error', err); 
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (!queue.length) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
        <GlassCard className="text-center p-12 max-w-md" glowLine>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
          <p className="text-slate-400 mb-6">You have no pending reviews. Great job keeping up with your learning!</p>
          <CyanButton onClick={() => navigate('/dashboard')} glow>
            Back to Dashboard
          </CyanButton>
        </GlassCard>
      </div>
    );
  }

  const card = queue[index];
  const dueCount = stats?.due || queue.length;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Spaced Repetition Review</h1>
            <p className="text-slate-400 mt-1">Strengthen your memory with smart reviews</p>
          </div>
          <div className="glass-card px-6 py-3 rounded-full text-center">
            <div className="text-sm text-slate-400">Due Today</div>
            <div className="text-2xl font-bold text-cyan-400">{dueCount}</div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <GlassCard className="text-center p-4">
              <div className="text-cyan-400 text-2xl font-bold">{stats.reviewStreak || 0}</div>
              <div className="text-slate-400 text-sm">Day Streak</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <div className="text-cyan-400 text-2xl font-bold">{stats.masteredItems || 0}</div>
              <div className="text-slate-400 text-sm">Mastered</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <div className="text-cyan-400 text-2xl font-bold">{dueCount}</div>
              <div className="text-slate-400 text-sm">Due Today</div>
            </GlassCard>
          </div>
        )}

        {/* Review Card */}
        <GlassCard className="p-8 mb-6" glowLine>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-cyan-400 uppercase tracking-wider">
              Review {index + 1} of {queue.length}
            </span>
            <span className="text-sm text-slate-500">
              {card.nextReviewDate ? `Next: ${new Date(card.nextReviewDate).toLocaleDateString()}` : 'New'}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">
            {card.question?.text || 'Question not available'}
          </h2>

          {/* Previous Answer */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
            <p className="text-sm text-slate-400 mb-1">Your previous answer:</p>
            <p className="text-white font-medium">{card.lastAnswer || card.selectedAnswer || '—'}</p>
          </div>

          {/* Correct Answer */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <p className="text-sm text-emerald-400 mb-1">✓ Correct answer:</p>
            <p className="text-white font-medium">{card.correctAnswer || (card.question?.correctAnswer) || '—'}</p>
          </div>

          {/* Explanation */}
          {(card.explanation || card.question?.explanation) && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-sm text-cyan-400 mb-1">📖 Explanation:</p>
              <p className="text-slate-300 text-sm">{card.explanation || card.question?.explanation}</p>
            </div>
          )}
        </GlassCard>

        {/* Quality Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => submitQuality(2)}
            disabled={submitting}
            className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition disabled:opacity-50"
          >
            🔄 Again
          </button>
          <button
            onClick={() => submitQuality(3)}
            disabled={submitting}
            className="px-4 py-3 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 font-medium hover:bg-orange-500/30 transition disabled:opacity-50"
          >
            😓 Hard
          </button>
          <button
            onClick={() => submitQuality(4)}
            disabled={submitting}
            className="px-4 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/30 transition disabled:opacity-50"
          >
            👍 Good
          </button>
          <button
            onClick={() => submitQuality(5)}
            disabled={submitting}
            className="px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium hover:bg-emerald-500/30 transition disabled:opacity-50"
          >
            ⚡ Easy
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center">
          <div className="text-sm text-slate-500">
            Card {index + 1} of {queue.length}
          </div>
          <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / queue.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;