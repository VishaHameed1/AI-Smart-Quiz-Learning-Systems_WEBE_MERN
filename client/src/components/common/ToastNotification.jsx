import React from 'react';

const ToastNotification = ({ message, type = 'info' }) => {
  if (!message) return null;

  const bgColor =
    type === 'success'
      ? 'bg-emerald-500'
      : type === 'error'
      ? 'bg-rose-500'
      : 'bg-sky-600';

  return (
    <div className={`fixed top-5 right-5 z-50 rounded-3xl px-5 py-4 text-sm font-semibold text-white shadow-report ${bgColor}`}>
      {message}
    </div>
  );
};

export default ToastNotification;
