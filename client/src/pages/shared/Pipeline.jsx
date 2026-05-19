import React from 'react';

const Pipeline = () => {
  const nodes = [
    { icon: '📋', label: 'QUIZ', color: 'cyan' },
    { icon: '🧠', label: 'AI CORE', color: 'purple' },
    { icon: '📊', label: 'ANALYSIS', color: 'cyan' },
    { icon: '🏆', label: 'MASTERY', color: 'purple' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-8">
      {nodes.map((node, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center text-3xl md:text-4xl ai-node">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20" />
              <span>{node.icon}</span>
            </div>
            <span className="text-xs md:text-sm font-semibold tracking-wider text-slate-300">{node.label}</span>
          </div>
          {idx < nodes.length - 1 && (
            <div className="w-8 h-px md:w-12 border-t border-dashed border-slate-500" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Pipeline;