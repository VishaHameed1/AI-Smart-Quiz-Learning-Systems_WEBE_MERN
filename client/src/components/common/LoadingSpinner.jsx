import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.3)]"></div>
    </div>
  );
};

export default LoadingSpinner;