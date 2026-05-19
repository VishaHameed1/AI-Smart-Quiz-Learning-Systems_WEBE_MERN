import React from 'react';

const GlassCard = ({ children, className = '', hover3d = true, glowLine = false }) => {
  return (
    <div 
      className={`relative glass-card rounded-2xl p-6 overflow-hidden ${hover3d ? 'hover:rotate-effect' : ''} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.28s ease, border-color 0.28s ease'
      }}
    >
      {glowLine && (
        <div className="glow-line" style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '1px',
          width: '100%',
          background: 'linear-gradient(90deg, transparent, #00f2ff, transparent)',
          animation: 'glowMove 3s linear infinite'
        }} />
      )}
      {children}
    </div>
  );
};

export default GlassCard;