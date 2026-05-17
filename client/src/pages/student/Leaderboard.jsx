import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CyanButton from '../../components/common/CyanButton';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => { 
    fetchLeaders(); 
    fetchCurrentUser();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gamification/leaderboard');
      setLeaders(res.data.data || []);
    } catch (err) { 
      console.error('Failed to fetch leaderboard', err); 
    }
    setLoading(false);
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  };

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-slate-400';
      case 3: return 'text-amber-600';
      default: return 'text-slate-500';
    }
  };

  const getMedalIcon = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  if (loading) return <LoadingSpinner />;

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">🏆 Leaderboard</h1>
          <p className="text-slate-400 mt-2">Top performers this month</p>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-12">
            {/* 2nd Place */}
            <div className="text-center order-1">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-3xl mb-2">
                🥈
              </div>
              <div className="glass-card px-4 py-2 rounded-xl text-center min-w-[100px]">
                <div className="font-bold text-white truncate">{top3[1]?.name || 'Player'}</div>
                <div className="text-cyan-400 font-bold">{top3[1]?.xp || 0} XP</div>
                <div className="text-xs text-slate-500">Level {top3[1]?.level || 1}</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center order-0 md:order-2 -mt-8">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-5xl mb-2 shadow-lg shadow-yellow-500/20">
                👑
              </div>
              <div className="glass-card px-6 py-3 rounded-xl text-center min-w-[120px] border-yellow-500/30">
                <div className="font-bold text-xl text-white truncate">{top3[0]?.name || 'Champion'}</div>
                <div className="text-yellow-400 font-bold text-lg">{top3[0]?.xp || 0} XP</div>
                <div className="text-xs text-slate-500">Level {top3[0]?.level || 1}</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center order-2 md:order-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-3xl mb-2">
                🥉
              </div>
              <div className="glass-card px-4 py-2 rounded-xl text-center min-w-[100px]">
                <div className="font-bold text-white truncate">{top3[2]?.name || 'Player'}</div>
                <div className="text-cyan-400 font-bold">{top3[2]?.xp || 0} XP</div>
                <div className="text-xs text-slate-500">Level {top3[2]?.level || 1}</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <GlassCard className="p-6" glowLine>
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl bg-white/5 text-sm font-medium text-slate-400 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-6">User</div>
              <div className="col-span-3 text-right">XP</div>
              <div className="col-span-2 text-right">Level</div>
            </div>

            {/* Rest of the users */}
            {rest.map((user, idx) => {
              const rank = idx + 4;
              const isCurrentUser = currentUser?._id === user._id;
              return (
                <div 
                  key={user._id}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-xl transition-all ${
                    isCurrentUser 
                      ? 'bg-cyan-500/20 border border-cyan-500/30' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`col-span-1 font-bold ${getMedalColor(rank)}`}>
                    #{rank}
                  </div>
                  <div className="col-span-6 flex items-center gap-3">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00f2ff&color=fff`} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full" 
                    />
                    <span className="text-white font-medium">{user.name}</span>
                    {isCurrentUser && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-400">You</span>
                    )}
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-cyan-400 font-bold">{user.xp || 0}</span>
                    <span className="text-slate-500 text-sm ml-1">XP</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-white">{user.level || 1}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {leaders.length === 0 && (
            <p className="text-slate-400 text-center py-12">No data available yet. Complete quizzes to appear on leaderboard!</p>
          )}
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <CyanButton onClick={() => navigate('/dashboard')} glow>
            Back to Dashboard
          </CyanButton>
          <button 
            onClick={() => navigate('/quizzes')}
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition"
          >
            Take a Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;