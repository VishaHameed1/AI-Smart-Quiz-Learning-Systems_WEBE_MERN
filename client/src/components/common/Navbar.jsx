﻿import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { token, logout, user } = useAuth();
  const [due, setDue] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (token && user) {
      const fetchNotifications = async () => {
        try {
          if (user.role === 'teacher') {
            // Fetch teacher dashboard data to get pending requests count
            const res = await api.get('/dashboard/teacher');
            if (mounted) setDue(res.data.data.pendingEnrollmentsCount || 0);
          } else if (user.role === 'student') {
            const res = await api.get('/review/due/count');
            if (mounted) setDue(res.data.data.count || 0);
          }
        } catch (err) {
          console.error('Notification fetch error:', err);
        }
      };
      fetchNotifications();
    }
    return () => { mounted = false; };
  }, [token, user]);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <div className="glass-card max-w-[1280px] w-full mx-4 px-6 py-3 rounded-full border-white/10 backdrop-blur-xl shadow-soft flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-black text-slate-950">IQ</div>
          <div>
            <div className="text-sm font-semibold text-slate-100">AI Smart Quiz</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-[0.3em]">Live Studio</div>
          </div>
        </Link>

        {/* Student Links */}
        {token && user?.role === 'student' && (
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            <Link to="/dashboard/student" className="nav-link text-sm font-medium text-slate-300">Dashboard</Link>
            <Link to="/quizzes" className="nav-link text-sm font-medium text-slate-300">Quizzes</Link>
            <Link to="/progress" className="nav-link text-sm font-medium text-slate-300">Progress</Link>
            <Link to="/review" className="nav-link text-sm font-medium text-slate-300">Review</Link>
            <Link to="/leaderboard" className="nav-link text-sm font-medium text-slate-300">Leaderboard</Link>
          </div>
        )}

        {/* Teacher Specific Links */}
        {token && user?.role === 'teacher' && (
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            <Link to="/dashboard/teacher" className="nav-link text-sm font-medium text-slate-300">Dashboard</Link>
            <Link to="/teacher/quizzes" className="nav-link text-sm font-medium text-slate-300">Quizzes</Link>
            <Link to="/teacher/create-quiz" className="nav-link text-sm font-medium text-slate-300">Create Quiz</Link>
            <Link to="/teacher/ai-generate" className="nav-link text-sm font-medium text-slate-300">AI Tools</Link>
            <Link to="/teacher/enrollment-requests" className="nav-link text-sm font-medium text-slate-300">Requests</Link>
          </div>
        )}

        {/* Admin Specific Links */}
        {token && user?.role === 'admin' && (
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            <Link to="/dashboard/admin" className="nav-link text-sm font-medium text-slate-300 text-cyan-400 font-bold">Admin Panel</Link>
            <Link to="/admin/users" className="nav-link text-sm font-medium text-slate-300">Users</Link>
            <Link to="/admin/folders" className="nav-link text-sm font-medium text-slate-300">Folders</Link>
            <Link to="/teacher/quizzes" className="nav-link text-sm font-medium text-slate-300">System Quizzes</Link>
            <Link to="/admin/cleanup" className="nav-link text-sm font-medium text-slate-300">Maintenance</Link>
          </div>
        )}

        {/* Non-logged in links */}
        {!token && (
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            <Link to="/" className="nav-link text-sm font-medium text-slate-300">Home</Link>
            <Link to="/quizzes" className="nav-link text-sm font-medium text-slate-300">Quizzes</Link>
            <Link to="/leaderboard" className="nav-link text-sm font-medium text-slate-300">Leaderboard</Link>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {token && (
            <Link 
              to={user?.role === 'teacher' ? "/teacher/enrollment-requests" : "/review"} 
              className="relative group"
              title={user?.role === 'teacher' ? "Enrollment Requests" : "Reviews Due"}
            >
              <Bell className="w-6 h-6 text-slate-200 group-hover:text-cyan-400 transition-colors" />
              {due > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#030712] animate-pulse">
                  {due}
                </span>
              )}
            </Link>
          )}
          {token ? (
            <button onClick={logout} className="inline-flex items-center rounded-full bg-white text-slate-950 font-semibold px-5 py-2 shadow hover:bg-slate-100 transition">
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="inline-flex items-center rounded-full bg-white text-slate-950 font-semibold px-5 py-2 shadow hover:bg-slate-100 transition">
              Launch App
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;