import React from 'react';

const TwoFactorAuth = () => {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 lg:px-8">
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Two-Factor Authentication</h2>
        <p className="text-slate-600 mb-6">Enter the 6-digit code from your authenticator app.</p>
        <form className="space-y-4">
          <input type="text" placeholder="Enter 6-digit code" className="glass-input" />
          <button className="glass-button w-full text-center">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
