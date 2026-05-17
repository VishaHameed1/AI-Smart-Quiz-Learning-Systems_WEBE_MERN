import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Showcase from './pages/shared/Showcase';
import LoginPage from './pages/shared/LoginPage';
import RegisterPage from './pages/shared/RegisterPage';
import QuizList from './pages/student/QuizList';
import StudentDashboard from './pages/student/Dashboard';
import QuizHistory from './pages/student/QuizHistory';
import Progress from './pages/student/Progress';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResult from './pages/student/QuizResult';
import ProfilePage from './pages/shared/ProfilePage';
import CreateQuiz from './pages/teacher/CreateQuiz';
import ManageQuestions from './pages/teacher/ManageQuestions';
import QuestionBank from './pages/teacher/QuestionBank';
import AIQuestionGen from './pages/teacher/AIQuestionGen';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherQuizzes from './pages/teacher/TeacherQuizzes';
import TeacherStudents from './pages/teacher/TeacherStudents';
import StudentProgress from './pages/teacher/StudentProgress';
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import TeacherClassReport from './pages/teacher/TeacherClassReport';
import EditQuiz from './pages/teacher/EditQuiz';
import Review from './pages/student/Review';
import Leaderboard from './pages/student/Leaderboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminCleanup from './pages/admin/AdminCleanup';

// Components
import Navbar from './components/common/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            <main className="container mx-auto px-4 pt-28 pb-12">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Showcase />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/showcase" element={<Showcase />} />
                <Route path="/dashboard" element={
                  <PrivateRoute allowedRoles={["student","teacher","admin"]}>
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
                <Route path="/teacher/dashboard" element={
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
                <Route path="/admin/dashboard" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </PrivateRoute>
                } />
                <Route path="/admin/cleanup" element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminCleanup />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
          </div>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;