import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const roleNavItems = {
  student: [
    { label: 'Overview', to: '/dashboard/student' },
    { label: 'Quizzes', to: '/quizzes' },
    { label: 'Progress', to: '/progress' },
    { label: 'Review', to: '/review' },
    { label: 'Leaderboard', to: '/leaderboard' },
  ],
  teacher: [
    { label: 'Dashboard', to: '/dashboard/teacher' },
    { label: 'My Students', to: '/teacher/students' },
    { label: 'Create Quiz', to: '/teacher/create-quiz' },
    { label: 'Reports', to: '/teacher/reports' },
    { label: 'Question Bank', to: '/teacher/question-bank' },
  ],
  admin: [
    { label: 'Admin Dashboard', to: '/dashboard/admin' },
    { label: 'User Management', to: '/admin/users' },
    { label: 'System Analytics', to: '/admin/analytics' },
    { label: 'Create User', to: '/admin/create-user' },
  ]
};

const Sidebar = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const navItems = roleNavItems[user.role] || roleNavItems.student;
  const workspaceName = user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' Portal';

  return (
    <aside className="hidden xl:flex xl:w-[280px] flex-col gap-6 border-r border-slate-200 bg-white px-5 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Workspace</p>
        <h2 className="mt-3 text-xl font-semibold text-slate-900">{workspaceName}</h2>
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
