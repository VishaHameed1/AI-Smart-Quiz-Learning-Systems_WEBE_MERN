import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[16rem] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[4px] border-t-[#2563eb]" />
    </div>
  );
};

export default LoadingSpinner;
