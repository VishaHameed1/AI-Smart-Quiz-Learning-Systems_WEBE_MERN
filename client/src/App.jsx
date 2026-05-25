import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import PrivateRoute from './components/common/PrivateRoute';
import Sidebar from './components/common/Sidebar'; // Added Sidebar import
import ToastNotification from './components/common/ToastNotification'; // Added ToastNotification import
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
// Consolidate imports to avoid redundancy and improve readability
import Showcase from './pages/shared/Showcase';
import LoginPage from './pages/shared/LoginPage';
import RegisterPage from './pages/shared/RegisterPage';
import QuizList from './pages/student/QuizList';
import StudentDashboard from './pages/student/Dashboard';
import QuizHistory from './pages/student/QuizHistory';
import Progress from './pages/student/Progress';
import QuizResult from './pages/student/QuizResult';
import ProfilePage from './pages/shared/ProfilePage';
import CreateQuiz from './pages/teacher/CreateQuiz';
import ManageQuestions from './pages/teacher/ManageQuestions';
import QuestionBank from './pages/teacher/QuestionBank';
import AIQuestionGen from './pages/teacher/AIQuestionGen';
import TeacherDashboard from './components/common/TeacherDashboard';
import TeacherQuizzes from './pages/teacher/TeacherQuizzes';
import TeacherStudents from './pages/teacher/TeacherStudents';
import StudentProgress from './pages/teacher/StudentProgress';
import TeachersList from './pages/student/TeachersList'; // New
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import EnrollmentRequests from './pages/teacher/EnrollmentRequests'; // New
import TeacherFolders from './pages/teacher/TeacherFolders'; // New
import TeacherClassReport from './pages/teacher/TeacherClassReport';
import EditQuiz from './pages/teacher/EditQuiz';
import Review from './pages/student/Review';
import Leaderboard from './pages/student/Leaderboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminFolderManagement from './pages/admin/AdminFolderManagement'; // New
import FolderDetail from './pages/student/FolderDetail'; // New
import AdminQuizManagement from './pages/admin/AdminQuizManagement'; // New
import AdminCleanup from './pages/admin/AdminCleanup';
import QuizPaperGenerator from './pages/teacher/QuizPaperGenerator';
import TakeQuiz from './pages/student/TakeQuiz'; // Moved TakeQuiz here for clarity

// ========== PERSON B - USER & LEARNING PAGES ==========
// Auth Pages
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import TwoFactorAuth from './components/auth/TwoFactorAuth';

// Dashboard Pages
// import DashboardPage from './pages/DashboardPage'; // This was a generic dashboard, now using role-specific ones

// Onboarding Pages
import RoleSelection from './RoleSelection'; // Moved from server/middleware
import TeacherOnboarding from './TeacherOnboarding'; // Moved from server/middleware
import AdminOnboarding from './AdminOnboarding';
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

function App() {
  const dispatch = useDispatch();
  const { loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Attempt to load user from token on app start
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <QuizProvider>
          <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            <main className="container mx-auto px-4 pt-28 pb-12"> {/* Adjusted padding for fixed navbar */}
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Showcase />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/role-selection" element={
                  <PrivateRoute>
                    <RoleSelection />
                  </PrivateRoute>
                } />
                <Route path="/onboarding/teacher" element={
                  <PrivateRoute allowedRoles={['teacher']}>
                    <TeacherOnboarding />
                  </PrivateRoute>
                } />
                <Route path="/onboarding/admin" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminOnboarding />
                  </PrivateRoute>
                } />
                <Route path="/dashboard/student" element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute allowedRoles={["student","teacher","admin"]}>
                    <ProfilePage />
                  </PrivateRoute>
                } />
                
                {/* Student Routes */}
                <Route path="/quizzes" element={
                  <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <QuizList />
                  </PrivateRoute>
                } />
                <Route path="/quizzes/folder/:folderId" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <FolderDetail />
                  </PrivateRoute>
                } />
                <Route path="/teachers" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <TeachersList />
                  </PrivateRoute>
                } />
                <Route path="/quiz/:quizId/take/:attemptId" element={
                  <PrivateRoute allowedRoles={['student']}>
                    <TakeQuiz />
                  </PrivateRoute>
                } />
                <Route path="/review" element={
                  <PrivateRoute allowedRoles={['student','teacher','admin']}>
                    <Review />
                  </PrivateRoute>
                } />
                <Route path="/quiz/result/:attemptId" element={
                  <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <QuizResult />
                  </PrivateRoute>
                } />
                <Route path="/history" element={
                  <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <QuizHistory />
                  </PrivateRoute>
                } />
                <Route path="/progress" element={
                  <PrivateRoute allowedRoles={['student','teacher','admin']}>
                    <Progress />
                  </PrivateRoute>
                } />
                <Route path="/leaderboard" element={
                  <PrivateRoute allowedRoles={['student','teacher','admin']}>
                    <Leaderboard />
                  </PrivateRoute>
                } />
                
                {/* Teacher Routes */}
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
                <Route path="/teacher/quizzes" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherQuizzes />
                  </PrivateRoute>
                } />
                <Route path="/dashboard/teacher" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherDashboard />
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
                <Route path="/teacher/students" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherStudents />
                  </PrivateRoute>
                } />
                <Route path="/teacher/students/:studentId/progress" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <StudentProgress />
                  </PrivateRoute>
                } />
                <Route path="/teacher/analytics" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherAnalytics />
                  </PrivateRoute>
                } />
                <Route path="/teacher/class-report" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherClassReport />
                  </PrivateRoute>
                } />
                <Route path="/teacher/quiz/:quizId/edit" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <EditQuiz />
                  </PrivateRoute>
                } />
                <Route path="/teacher/enrollment-requests" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <EnrollmentRequests />
                  </PrivateRoute>
                } />
                <Route path="/teacher/folders" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <TeacherFolders />
                  </PrivateRoute>
                } />
                <Route path="/teacher/quiz/:quizId/print" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <QuizPaperGenerator />
                  </PrivateRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/folders" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminFolderManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/quizzes" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminQuizManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/cleanup" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminCleanup />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <ToastNotification />
          </div>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;