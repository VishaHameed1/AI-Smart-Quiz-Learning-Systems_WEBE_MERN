import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl glass-panel p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">{user?.name || 'Your profile'}</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{user?.role || 'Student'}</span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="glass-panel p-6">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{user?.name || 'N/A'}</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{user?.email || 'N/A'}</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{user?.role || 'N/A'}</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-sm text-slate-500">Member Since</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
