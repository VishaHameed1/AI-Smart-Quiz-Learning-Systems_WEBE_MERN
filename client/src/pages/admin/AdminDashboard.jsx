import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, quizzesRes, attemptsRes] = await Promise.all([
          api.get('/admin/stats/users').catch(() => ({ data: { data: { total: 0 } } })),
          api.get('/admin/stats/quizzes').catch(() => ({ data: { data: { total: 0 } } })),
          api.get('/admin/stats/attempts').catch(() => ({ data: { data: { total: 0 } } }))
        ]);
        setStats({
          totalUsers: usersRes.data.data?.total || 0,
          totalQuizzes: quizzesRes.data.data?.total || 0,
          totalAttempts: attemptsRes.data.data?.total || 0
        });
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const adminCards = [
    { 
      title: 'User Management', 
      description: 'View learners, teachers, and admins, update permissions, or remove accounts.',
      link: '/admin/users',
      icon: '👥',
      color: 'cyan'
    },
    { 
      title: 'Create Quiz', 
      description: 'Build new adaptive assessments and assign them to your training programs.',
      link: '/teacher/create-quiz',
      icon: '📝',
      color: 'emerald'
    },
    { 
      title: 'AI Question Tools', 
      description: 'Generate AI-driven questions and content for lessons and quizzes.',
      link: '/teacher/ai-generate',
      icon: '🤖',
      color: 'purple'
    },
    { 
      title: 'Cleanup Tools', 
      description: 'Run database cleanup operations for old attempts, reviews, and AI cache.',
      link: '/admin/cleanup',
      icon: '🧹',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🛡️ Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage users, quizzes, analytics and the overall system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <GlassCard className="p-6 text-center" glowLine>
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Total Users</p>
            <p className="mt-2 text-4xl font-bold text-cyan-400">{stats?.totalUsers || 0}</p>
          </GlassCard>
          <GlassCard className="p-6 text-center" glowLine>
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Total Quizzes</p>
            <p className="mt-2 text-4xl font-bold text-cyan-400">{stats?.totalQuizzes || 0}</p>
          </GlassCard>
          <GlassCard className="p-6 text-center" glowLine>
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Total Attempts</p>
            <p className="mt-2 text-4xl font-bold text-cyan-400">{stats?.totalAttempts || 0}</p>
          </GlassCard>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminCards.map((card, idx) => (
            <Link key={idx} to={card.link}>
              <GlassCard 
                className="p-6 h-full transition-all duration-300 hover:translate-y-[-4px] cursor-pointer" 
                hover3d
                glowLine
              >
                <div className={`text-4xl mb-4 bg-${card.color}-500/20 w-16 h-16 rounded-2xl flex items-center justify-center`}>
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{card.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
                <div className="mt-4 text-cyan-400 text-sm flex items-center gap-1">
                  Access →
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;