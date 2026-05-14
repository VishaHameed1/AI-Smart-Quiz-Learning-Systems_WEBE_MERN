import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const RoleSelection = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.onboardingCompleted) {
      // If user is authenticated and onboarding is completed, redirect to their dashboard
      navigate(`/dashboard/${user.role}`);
    } else if (!loading && isAuthenticated && user?.role && !user.onboardingCompleted) {
      // If user has a role but hasn't completed onboarding, redirect to their specific onboarding page
      navigate(`/onboarding/${user.role}`);
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleRoleSelect = async (role) => {
    if (role === 'student') {
      await updateProfile({ role, onboardingCompleted: true });
    } else {
      await updateProfile({ role }); // onboardingCompleted remains false for teacher/admin until they complete their specific onboarding
    }
    navigate(role === 'student' ? '/dashboard/student' : `/onboarding/${role}`); // Redirect to specific onboarding page
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Take quizzes, track progress, and improve your skills.',
      icon: <GraduationCap className="w-12 h-12 text-blue-500" />,
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Create quizzes, manage classes, and analyze student performance.',
      icon: <User className="w-12 h-12 text-green-500" />,
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Full system access, user management, and global analytics.',
      icon: <ShieldCheck className="w-12 h-12 text-purple-500" />,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900">Choose Your Role</h2>
        <p className="mt-2 text-gray-600">Select how you want to use the AI Quiz System</p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 flex flex-col items-center text-center"
          >
            <div className="mb-4">{role.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
            <p className="text-gray-500 text-sm">{role.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;