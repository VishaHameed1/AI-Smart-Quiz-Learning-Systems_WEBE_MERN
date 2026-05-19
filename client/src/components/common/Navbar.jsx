import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import api from '../../services/api';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { token, logout, user } = useAuth();
  const [due, setDue] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (token) {
      api.get('/review/due/count').then(r => { if (mounted) setDue(r.data.data.count || 0); }).catch(()=>{});
    }
    return () => { mounted = false; };
  }, [token]);

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
            <Link to="/dashboard" className="nav-link text-sm font-medium text-slate-300">Dashboard</Link>
            <Link to="/quizzes" className="nav-link text-sm font-medium text-slate-300">Quizzes</Link>
            <Link to="/progress" className="nav-link text-sm font-medium text-slate-300">Progress</Link>
            <Link to="/review" className="nav-link text-sm font-medium text-slate-300">Review</Link>
            <Link to="/leaderboard" className="nav-link text-sm font-medium text-slate-300">Leaderboard</Link>
          </div>
        )}

        {/* Teacher & Admin Links */}
        {token && (user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            <Link to="/" className="nav-link text-sm font-medium text-slate-300">Home</Link>
            <Link to="/quizzes" className="nav-link text-sm font-medium text-slate-300">Quizzes</Link>
            <Link to="/teacher/dashboard" className="nav-link text-sm font-medium text-slate-300">Teacher Dashboard</Link>
            <Link to="/teacher/create-quiz" className="nav-link text-sm font-medium text-slate-300">Create Quiz</Link>
            <Link to="/teacher/ai-generate" className="nav-link text-sm font-medium text-slate-300">AI Tools</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="nav-link text-sm font-medium text-slate-300">Admin</Link>
            )}
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
            <Link to="/review" className="relative">
              <Bell className="w-6 h-6 text-slate-200" />
              {due > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{due}</span>}
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