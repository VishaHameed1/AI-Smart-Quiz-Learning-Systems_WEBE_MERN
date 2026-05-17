import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import teacherService from '../../services/teacherService';

const TeacherDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await teacherService.getAnalytics();
        setAnalytics(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Teacher Dashboard</h1>
          <p className="text-slate-400">Track learners, assignments, and classroom performance.</p>
        </div>
        <Link to="/teacher/create-quiz" className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow hover:bg-cyan-400 transition">
          Create New Quiz
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm uppercase tracking-wide text-slate-400">Active students</p>
          <p className="mt-3 text-3xl font-bold text-white">{analytics?.activeStudents ?? '—'}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm uppercase tracking-wide text-slate-400">Total students</p>
          <p className="mt-3 text-3xl font-bold text-white">{analytics?.totalStudents ?? '—'}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm uppercase tracking-wide text-slate-400">Avg quiz score</p>
          <p className="mt-3 text-3xl font-bold text-white">{analytics ? `${Math.round(analytics.avgScore)}%` : '—'}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/teacher/students" className="rounded-xl bg-slate-800 p-6 border border-white/10 shadow-lg hover:bg-slate-700 transition">
          <h2 className="text-xl font-semibold text-white mb-2">Student Roster</h2>
          <p className="text-slate-400">View enrolled learners and inspect individual progress.</p>
        </Link>
        <Link to="/teacher/quizzes" className="rounded-xl bg-slate-800 p-6 border border-white/10 shadow-lg hover:bg-slate-700 transition">
          <h2 className="text-xl font-semibold text-white mb-2">My Quizzes</h2>
          <p className="text-slate-400">View and manage quizzes created by you.</p>
        </Link>
        <Link to="/teacher/class-report" className="rounded-xl bg-slate-800 p-6 border border-white/10 shadow-lg hover:bg-slate-700 transition">
          <h2 className="text-xl font-semibold text-white mb-2">Class Report</h2>
          <p className="text-slate-400">Download a quick classroom performance summary.</p>
        </Link>
        <Link to="/teacher/analytics" className="rounded-xl bg-slate-800 p-6 border border-white/10 shadow-lg hover:bg-slate-700 transition">
          <h2 className="text-xl font-semibold text-white mb-2">Class Analytics</h2>
          <p className="text-slate-400">Review student performance and classroom trends.</p>
        </Link>
        <Link to="/teacher/question-bank" className="rounded-xl bg-slate-800 p-6 border border-white/10 shadow-lg hover:bg-slate-700 transition">
          <h2 className="text-xl font-semibold text-white mb-2">Question Bank</h2>
          <p className="text-slate-400">Search and reuse questions across quizzes.</p>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;
