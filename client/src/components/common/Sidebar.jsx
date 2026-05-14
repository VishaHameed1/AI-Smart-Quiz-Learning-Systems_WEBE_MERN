import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Quizzes', to: '/quizzes' },
  { label: 'Progress', to: '/progress' },
  { label: 'Review', to: '/review' },
  { label: 'Leaderboard', to: '/leaderboard' },
];

const Sidebar = () => {
  return (
    <aside className="hidden xl:flex xl:w-[280px] flex-col gap-6 border-r border-slate-200 bg-white px-5 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Workspace</p>
        <h2 className="mt-3 text-xl font-semibold text-slate-900">Learning Hub</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Need help?</p>
        <p className="mt-3 text-sm text-slate-600">Visit progress and review pages to stay on track.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
