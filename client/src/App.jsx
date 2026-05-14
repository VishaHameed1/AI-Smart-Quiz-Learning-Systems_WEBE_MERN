import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import PrivateRoute from './components/common/PrivateRoute';

// ========== PERSON A - QUIZ PAGES ==========
// Student Quiz Pages
import QuizList from './pages/student/QuizList';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResult from './pages/student/QuizResult';
import QuizHistory from './pages/student/QuizHistory';

// Teacher Quiz Pages
import CreateQuiz from './pages/teacher/CreateQuiz';
import ManageQuestions from './pages/teacher/ManageQuestions';
import AIQuestionGen from './pages/teacher/AIQuestionGen';
import EditQuiz from './pages/teacher/EditQuiz';
import QuestionBank from './pages/teacher/QuestionBank';

// ========== PERSON B - USER & LEARNING PAGES ==========
// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import TwoFactorAuth from './components/auth/TwoFactorAuth';

// Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import StudentDashboard from './components/dashboard/StudentDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Progress & Learning Pages
import ProgressPage from './pages/ProgressPage';
import ProgressOverview from './components/progress/ProgressOverview';
import Heatmap from './components/progress/Heatmap';
import SkillGapAnalysis from './components/progress/SkillGapAnalysis';
import TopicDetails from './components/progress/TopicDetails';

// Spaced Repetition Pages
import ReviewPage from './pages/ReviewPage';
import ReviewQueue from './components/review/ReviewQueue';
import ReviewCard from './components/review/ReviewCard';
import ReviewStats from './components/review/ReviewStats';

// Gamification Pages
import LeaderboardPage from './pages/LeaderboardPage';
import BadgesDisplay from './components/gamification/BadgesDisplay';
import LevelProgress from './components/gamification/LevelProgress';
import Achievements from './components/gamification/Achievements';

// Profile Pages
import ProfilePage from './pages/ProfilePage';
import ProfileSettings from './components/profile/ProfileSettings';
import LearningPreferences from './components/profile/LearningPreferences';
import NotificationSettings from './components/profile/NotificationSettings';
import SecuritySettings from './components/profile/SecuritySettings';

// Teacher Management Pages
import TeacherPortal from './pages/TeacherPortal';
import StudentManagement from './components/teacher/StudentManagement';
import ClassReports from './components/teacher/ClassReports';
import AssignQuiz from './components/teacher/AssignQuiz';
import StudentProgressView from './components/teacher/StudentProgressView';

// ========== SHARED PAGES ==========
import LandingPage from './pages/shared/LandingPage';
import HomePage from './pages/HomePage';

// ========== COMMON COMPONENTS ==========
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ToastNotification from './components/common/ToastNotification';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <div className="min-h-screen bg-transparent text-slate-900">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-h-screen px-4 py-8 xl:px-8">
                <Routes>
                  {/* ========== PUBLIC ROUTES ========== */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<HomePage />} />
                  
                  {/* ========== AUTH ROUTES ========== */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/2fa" element={<TwoFactorAuth />} />

                  {/* ========== PERSON A - QUIZ ROUTES ========== */}
                  {/* Student Quiz Routes */}
                  <Route path="/quizzes" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <QuizList />
                    </PrivateRoute>
                  } />
                  <Route path="/quiz/:quizId/take/:attemptId" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <TakeQuiz />
                    </PrivateRoute>
                  } />
                  <Route path="/quiz/result/:attemptId" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <QuizResult />
                    </PrivateRoute>
                  } />
                  <Route path="/quiz-history" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <QuizHistory />
                    </PrivateRoute>
                  } />

                  {/* Teacher Quiz Management Routes */}
                  <Route path="/teacher/create-quiz" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <CreateQuiz />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/quiz/:quizId/questions" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <ManageQuestions />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/quiz/:quizId/edit" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <EditQuiz />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/ai-generate" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <AIQuestionGen />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/question-bank" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <QuestionBank />
                    </PrivateRoute>
                  } />

                  {/* ========== PERSON B - USER & LEARNING ROUTES ========== */}
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <DashboardPage />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/student" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/teacher" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <TeacherDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/admin" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />

                  {/* Progress Routes */}
                  <Route path="/progress" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <ProgressPage />
                    </PrivateRoute>
                  } />
                  <Route path="/progress/overview" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <ProgressOverview />
                    </PrivateRoute>
                  } />
                  <Route path="/progress/heatmap" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <Heatmap />
                    </PrivateRoute>
                  } />
                  <Route path="/progress/skill-gaps" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <SkillGapAnalysis />
                    </PrivateRoute>
                  } />
                  <Route path="/progress/topic/:topic" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <TopicDetails />
                    </PrivateRoute>
                  } />

                  {/* Spaced Repetition Routes */}
                  <Route path="/review" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <ReviewPage />
                    </PrivateRoute>
                  } />
                  <Route path="/review/queue" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <ReviewQueue />
                    </PrivateRoute>
                  } />
                  <Route path="/review/card/:id" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <ReviewCard />
                    </PrivateRoute>
                  } />
                  <Route path="/review/stats" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <ReviewStats />
                    </PrivateRoute>
                  } />

                  {/* Gamification Routes */}
                  <Route path="/leaderboard" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <LeaderboardPage />
                    </PrivateRoute>
                  } />
                  <Route path="/badges" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <BadgesDisplay />
                    </PrivateRoute>
                  } />
                  <Route path="/level" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <LevelProgress />
                    </PrivateRoute>
                  } />
                  <Route path="/achievements" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <Achievements />
                    </PrivateRoute>
                  } />

                  {/* Profile Routes */}
                  <Route path="/profile" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <ProfilePage />
                    </PrivateRoute>
                  } />
                  <Route path="/profile/settings" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <ProfileSettings />
                    </PrivateRoute>
                  } />
                  <Route path="/profile/preferences" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <LearningPreferences />
                    </PrivateRoute>
                  } />
                  <Route path="/profile/notifications" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <NotificationSettings />
                    </PrivateRoute>
                  } />
                  <Route path="/profile/security" element={
                    <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                      <SecuritySettings />
                    </PrivateRoute>
                  } />

                  {/* Teacher Management Routes */}
                  <Route path="/teacher/portal" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <TeacherPortal />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/students" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <StudentManagement />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/reports" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <ClassReports />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/assign/:quizId" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <AssignQuiz />
                    </PrivateRoute>
                  } />
                  <Route path="/teacher/student/:studentId/progress" element={
                    <PrivateRoute allowedRoles={['teacher', 'admin']}>
                      <StudentProgressView />
                    </PrivateRoute>
                  } />

                  {/* ========== 404 FALLBACK ========== */}
                  <Route path="*" element={
                    <div className="text-center py-12">
                      <h1 className="text-4xl font-bold text-gray-700">404</h1>
                      <p className="text-gray-500 mt-2">Page not found</p>
                      <a href="/" className="text-blue-600 mt-4 inline-block">Go Home</a>
                    </div>
                  } />
                </Routes>
              </main>
            </div>
            <Footer />
            <ToastNotification />
          </div>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;