import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminOnboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const completeOnboarding = async () => {
    await updateProfile({ onboardingCompleted: true });
    navigate('/dashboard/admin');
  };

  if (!user || user.role !== 'admin') {
    // Redirect if not an admin or not logged in
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Admin Onboarding</h2>
        <p className="mt-2 text-gray-600">Welcome, {user.name}! Let's set up your admin tools.</p>
        <div className="mt-8">
          {/* Placeholder for actual admin onboarding steps */}
          <p className="text-gray-500">Here you would add steps for system overview, user management, analytics, etc.</p>
          <button onClick={completeOnboarding} className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;