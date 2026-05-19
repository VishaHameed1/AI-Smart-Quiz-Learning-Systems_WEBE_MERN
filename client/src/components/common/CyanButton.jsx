import React from 'react';

const CyanButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  fullWidth = false,
  glow = true,
  size = 'md'
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full font-semibold transition-all duration-200
        bg-[#00f2ff] text-[#030712]
        hover:brightness-110 hover:translate-y-[-2px]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${glow ? 'shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]' : ''}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CyanButton;