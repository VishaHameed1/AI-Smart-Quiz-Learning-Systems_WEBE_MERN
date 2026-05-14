import React from 'react';
import { ArrowRight } from 'lucide-react';

const ProfileSwitcher = ({ user }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-slate-100 text-slate-700">
          <span className="text-lg font-bold">{user?.name?.charAt(0) || 'A'}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'Alex Nguyen'}</p>
          <p className="text-sm text-slate-500">Senior Engineering Coach</p>
        </div>
      </div>
      <button className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
        Switch profile <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProfileSwitcher;
