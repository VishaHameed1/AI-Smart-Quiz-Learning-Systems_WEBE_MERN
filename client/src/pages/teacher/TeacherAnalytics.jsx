import React, { useEffect, useState } from 'react';
import teacherService from '../../services/teacherService';

const TeacherAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await teacherService.getAnalytics();
        setAnalytics(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Class Analytics</h1>
      {loading ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-200">Loading analytics...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm uppercase tracking-wide text-slate-400">Total students</p>
            <p className="mt-3 text-3xl font-bold text-white">{analytics?.totalStudents ?? '—'}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm uppercase tracking-wide text-slate-400">Active this week</p>
            <p className="mt-3 text-3xl font-bold text-white">{analytics?.activeStudents ?? '—'}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm uppercase tracking-wide text-slate-400">Average score</p>
            <p className="mt-3 text-3xl font-bold text-white">{analytics ? `${Math.round(analytics.avgScore)}%` : '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAnalytics;
