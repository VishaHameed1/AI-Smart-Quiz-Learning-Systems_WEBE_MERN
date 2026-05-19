import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, progressRes] = await Promise.all([
          api.get('/gamification/profile').catch(() => ({ data: { data: null } })),
          api.get('/progress/overview').catch(() => ({ data: { data: null } }))
        ]);
        setProfile(profileRes.data?.data);
        setProgress(progressRes.data?.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f2ff]"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total XP', value: profile?.totalXp ?? 0, icon: '⚡' },
    { label: 'Quizzes Completed', value: profile?.quizzesCompleted ?? 0, icon: '📝' },
    { label: 'Average Score', value: `${Math.round(profile?.avgScore ?? 0)}%`, icon: '📊' },
    { label: 'Current Streak', value: `${profile?.currentStreak ?? 0} days`, icon: '🔥' }
  ];

  const recentAttempts = progress?.recentAttempts || [];

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {user?.name || 'Learner'}
            </span>
          </h1>
          <p className="text-slate-400 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <GlassCard key={idx} className="text-center p-5" hover3d={false}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart Section */}
          <GlassCard className="lg:col-span-2" glowLine>
            <h2 className="text-xl font-semibold text-white mb-4">Performance Trend</h2>
            {recentAttempts.length > 0 ? (
              <div className="space-y-3">
                {recentAttempts.map((attempt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white font-medium">{attempt.quizTitle || 'Quiz'}</p>
                      <p className="text-slate-400 text-sm">{new Date(attempt.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold">{attempt.score}%</p>
                      <p className="text-slate-500 text-xs">+{attempt.xpEarned || 0} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No quiz attempts yet. Start your first quiz!</p>
            )}
          </GlassCard>

          {/* Topic Mastery Section */}
          <GlassCard glowLine>
            <h2 className="text-xl font-semibold text-white mb-4">Topic Mastery</h2>
            {progress?.topicMastery && Object.keys(progress.topicMastery).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(progress.topicMastery).slice(0, 5).map(([topic, score]) => (
                  <div key={topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{topic}</span>
                      <span className="text-cyan-400">{Math.round(score)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Complete quizzes to see topic mastery</p>
            )}
          </GlassCard>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <Link to="/quizzes">
            <CyanButton size="lg" glow>
              🎯 Start New Quiz
            </CyanButton>
          </Link>
          <Link to="/review">
            <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition">
              📚 Continue Review ({progress?.dueReviews || 0})
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;