import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import GlassCard from '../../components/common/GlassCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CyanButton from '../../components/common/CyanButton';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [skillGap, setSkillGap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [overviewRes, heatmapRes, skillGapRes] = await Promise.all([
          api.get('/progress/overview').catch(() => ({ data: { data: null } })),
          api.get('/progress/heatmap').catch(() => ({ data: { data: null } })),
          api.get('/progress/skill-gap').catch(() => ({ data: { data: [] } }))
        ]);
        setOverview(overviewRes.data.data);
        setHeatmap(heatmapRes.data.data);
        setSkillGap(skillGapRes.data.data || []);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  const radarData = overview?.topicMastery 
    ? Object.entries(overview.topicMastery).map(([topic, mastery]) => ({ topic, mastery: Math.round(mastery) }))
    : [];

  const recentPerformance = overview?.recentPerformance || [];
  const totalXP = overview?.totalXP || 0;
  const level = overview?.level || 1;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Progress & Analytics</h1>
            <p className="text-slate-400 mt-1">Track your learning journey</p>
          </div>
          <div className="glass-card px-6 py-3 rounded-full text-center">
            <div className="text-sm text-slate-400">Total XP</div>
            <div className="text-2xl font-bold text-cyan-400">{totalXP}</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="text-center p-5" glowLine>
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white">{overview?.totalQuizzes || 0}</div>
            <div className="text-slate-400 text-sm">Quizzes Completed</div>
          </GlassCard>
          <GlassCard className="text-center p-5" glowLine>
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white">{Math.round(overview?.avgScore || 0)}%</div>
            <div className="text-slate-400 text-sm">Average Score</div>
          </GlassCard>
          <GlassCard className="text-center p-5" glowLine>
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">{level}</div>
            <div className="text-slate-400 text-sm">Current Level</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart - Topic Mastery */}
          <GlassCard className="p-6" glowLine>
            <h3 className="text-xl font-bold text-white mb-4">Topic Mastery</h3>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} outerRadius={100}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                  <Radar name="Mastery" dataKey="mastery" stroke="#00f2ff" fill="#00f2ff" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-12">Complete quizzes to see topic mastery</p>
            )}
          </GlassCard>

          {/* Skill Gap Analysis */}
          <GlassCard className="p-6" glowLine>
            <h3 className="text-xl font-bold text-white mb-4">⚡ Skill Gap Analysis</h3>
            {skillGap.length > 0 ? (
              <div className="space-y-4">
                {skillGap.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{item.topic}</span>
                      <span className={`text-sm ${item.mastery < 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {Math.round(item.mastery)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full" style={{ width: `${item.mastery}%` }} />
                    </div>
                    <p className="text-slate-400 text-sm mt-2">
                      {item.mastery < 50 ? '⚠️ Needs improvement' : '📈 Getting there!'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-12">No weak areas detected. Great job! 🎉</p>
            )}
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Performance */}
          <GlassCard className="p-6" glowLine>
            <h3 className="text-xl font-bold text-white mb-4">📈 Recent Performance</h3>
            {recentPerformance.length > 0 ? (
              <div className="space-y-3">
                {recentPerformance.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white font-medium">{item.quizTitle || 'Quiz'}</p>
                      <p className="text-slate-500 text-xs">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold">{Math.round(item.score)}%</p>
                      <p className="text-slate-500 text-xs">+{item.xpEarned || 0} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-12">No quiz attempts yet</p>
            )}
          </GlassCard>

          {/* Activity Heatmap */}
          <GlassCard className="p-6" glowLine>
            <h3 className="text-xl font-bold text-white mb-4">🔥 Activity Heatmap</h3>
            {heatmap && Object.keys(heatmap).length > 0 ? (
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(heatmap).slice(-28).map(([date, count], idx) => (
                  <div 
                    key={idx}
                    className={`aspect-square rounded-md ${
                      count > 0 
                        ? `bg-cyan-500/${Math.min(80, 20 + count * 10)}` 
                        : 'bg-white/5'
                    }`}
                    title={`${date}: ${count} activities`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-12">Complete activities to see your heatmap</p>
            )}
          </GlassCard>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <CyanButton onClick={() => navigate('/quizzes')} glow>
            Start New Quiz
          </CyanButton>
          <button 
            onClick={() => navigate('/review')}
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition"
          >
            Review Weak Areas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Progress;