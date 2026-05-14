import React from 'react';

const SkillSlider = ({ label, value, minLabel, midLabel, maxLabel }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-sm text-slate-500">Track learner proficiency</p>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {value}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          readOnly
          className="accent-[#2563eb]"
        />
        <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default SkillSlider;
