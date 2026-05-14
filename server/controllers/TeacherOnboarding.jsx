import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TeacherOnboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const completeOnboarding = async () => {
    await updateProfile({ onboardingCompleted: true });
    navigate('/dashboard/teacher');
  };

  if (!user || user.role !== 'teacher') {
    // Redirect if not a teacher or not logged in
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Teacher Onboarding</h2>
        <p className="mt-2 text-gray-600">Welcome, {user.name}! Let's set up your teaching profile.</p>
        <div className="mt-8">
          {/* Placeholder for actual teacher onboarding steps */}
          <p className="text-gray-500">Here you would add steps for class creation, question authoring, assignment setup, etc.</p>
          <button onClick={completeOnboarding} className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherOnboarding;