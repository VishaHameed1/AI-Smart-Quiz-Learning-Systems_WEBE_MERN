import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminOnboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const completeOnboarding = async () => {
    await updateProfile({ onboardingCompleted: true });
    navigate('/dashboard/admin');
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Admin Onboarding</h2>
        <p className="mt-2 text-gray-600">Welcome, {user.name}! Let's set up your admin tools.</p>

        <div className="mt-8 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        <div className="mt-8">
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 1: System Overview</h3>
              <p className="text-gray-700">Familiarize yourself with the system's architecture and key functionalities.</p>
              <button
                onClick={() => setCurrentStep(2)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Next: Manage Users
              </button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 2: User Management</h3>
              <p className="text-gray-700">Add, edit, or remove users and manage permissions.</p>
              <button
                onClick={() => setCurrentStep(3)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Next: Set Up Analytics
              </button>
            </div>
          )}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Configure Analytics</h3>
              <p className="text-gray-700">Set up global analytics dashboards to monitor system performance.</p>
            </div>
          )}
          <button onClick={completeOnboarding} className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;