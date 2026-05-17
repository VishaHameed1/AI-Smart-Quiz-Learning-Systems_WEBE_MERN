import React from 'react';

const FloatingSnippet = ({ children, title, className = '' }) => {
  return (
    <div 
      className={`absolute glass-card rounded-xl p-3 float-vertical ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 242, 255, 0.3)',
        maxWidth: '180px'
      }}
    >
      {title && (
        <div className="text-[10px] uppercase tracking-wider text-cyan-400 mb-1">{title}</div>
      )}
      <code className="text-xs font-mono text-slate-200 break-all">
        {children}
      </code>
    </div>
  );
};

export default FloatingSnippet;