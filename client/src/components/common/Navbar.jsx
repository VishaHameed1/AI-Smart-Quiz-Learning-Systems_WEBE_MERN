import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const studentNavItems = [
  { label: 'Home', to: '/home' },
  { label: 'Dashboard', to: '/dashboard/student' },
  { label: 'Progress', to: '/progress' },
  { label: 'Quizzes', to: '/quizzes' },
];

const teacherNavItems = [
  { label: 'Home', to: '/home' },
  { label: 'Dashboard', to: '/dashboard/teacher' },
  { label: 'Students', to: '/teacher/students' },
  { label: 'Create Quiz', to: '/teacher/create-quiz' },
  { label: 'Analytics', to: '/teacher/analytics' },
];

const adminNavItems = [
  { label: 'Home', to: '/home' },
  { label: 'Dashboard', to: '/dashboard/admin' },
  { label: 'User Management', to: '/admin/users' },
  { label: 'System Overview', to: '/admin/overview' },
  { label: 'Create User', to: '/admin/create-user' },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  let currentNavItems = [];

  return (
    <nav className="sticky top-0 z-30 h-20 border-b border-white/30 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-gradient-to-br from-sky-500 to-violet-300 text-white shadow-glow">
            <span className="text-lg font-bold">Q</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">AI Quiz</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          {isAuthenticated && user ? (
            (() => {
              switch (user.role) {
                case 'student':
                  currentNavItems = studentNavItems;
                  break;
                case 'teacher':
                  currentNavItems = teacherNavItems;
                  break;
                case 'admin':
                  currentNavItems = adminNavItems;
                  break;
                default:
                  currentNavItems = studentNavItems;
              }
              return currentNavItems;
            })()
          ) : (
            [{ label: 'Home', to: '/home' }, { label: 'Quizzes', to: '/quizzes' }] // Public view
          ).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative transition duration-500 hover:text-slate-900"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-2 h-[2px] scale-x-0 bg-slate-900 transition-transform duration-500 hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-semibold text-slate-700">Welcome, {user.name}!</span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                Login
              </Link>
              <Link to="/register" className="glow-cta inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
