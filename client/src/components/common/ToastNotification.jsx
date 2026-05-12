import React from 'react';

const ToastNotification = ({ message, type = 'info' }) => {
  if (!message) return null;
  
  let bgColor = 'bg-blue-500';
  if (type === 'error') bgColor = 'bg-red-500';
  if (type === 'success') bgColor = 'bg-green-500';
  
  const className = 'fixed top-4 right-4 ' + bgColor + ' text-white p-4 rounded shadow-lg z-50';
  
  return (
    <div className={className}>
      {message}
    </div>
  );
};

export default ToastNotification;
