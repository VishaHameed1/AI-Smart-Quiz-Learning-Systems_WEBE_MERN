import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TeacherOnboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const completeOnboarding = async () => {
    await updateProfile({ onboardingCompleted: true });
    navigate('/dashboard/teacher');
  };

  if (!user || user.role !== 'teacher') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Teacher Onboarding</h2>
        <p className="mt-2 text-gray-600">Welcome, {user.name}! Let's set up your teaching profile.</p>

        <div className="mt-8 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        <div className="mt-8">
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Set Up Your Profile</h3>
              <p className="text-gray-700">Tell us a bit more about your teaching experience and subjects you specialize in.</p>
              <button
                onClick={() => setCurrentStep(2)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Next: Create Your First Class
              </button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Create Your First Class</h3>
              <p className="text-gray-700">Organize your students by creating classes.</p>
              <button
                onClick={() => setCurrentStep(3)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Next: Author a Quiz
              </button>
            </div>
          )}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Author Your First Quiz</h3>
              <p className="text-gray-700">Start creating engaging quizzes for your students. You can use our AI generation tools to help!</p>
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

export default TeacherOnboarding;