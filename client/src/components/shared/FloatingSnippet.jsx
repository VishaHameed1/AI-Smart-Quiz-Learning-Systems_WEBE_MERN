import React from 'react';

const FloatingSnippet = ({ title, children, className = '' }) => {
  return (
    <div className={`glass-card p-4 rounded-[28px] w-72 text-left relative overflow-hidden float-vertical ${className}`}>
      <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-200 mb-3">{title}</div>
      <div className="font-mono text-[13px] leading-6 text-slate-100">{children}</div>
    </div>
  );
};

export default FloatingSnippet;
