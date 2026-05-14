import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/home' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Progress', to: '/progress' },
  { label: 'Quizzes', to: '/quizzes' },
];

const Navbar = () => {
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
          {navItems.map((item) => (
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
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
            Login
          </Link>
          <Link to="/register" className="glow-cta inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
