import React from 'react';

const TwoFactorAuth = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Two Factor Authentication</h2>
      <p>Enter your 2FA code</p>
      <form>
        <input type="text" placeholder="Enter 6-digit code" className="w-full border p-2 rounded mb-4" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Verify</button>
      </form>
    </div>
  );
};

export default TwoFactorAuth;
