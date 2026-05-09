import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import LandingPage from './pages/shared/LandingPage';
import QuizList from './pages/student/QuizList';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResult from './pages/student/QuizResult';
import CreateQuiz from './pages/teacher/CreateQuiz';
import ManageQuestions from './pages/teacher/ManageQuestions';
import AIQuestionGen from './pages/teacher/AIQuestionGen';

// Components
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                
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
                <Route path="/quiz/result/:attemptId" element={
                  <PrivateRoute allowedRoles={['student', 'teacher', 'admin']}>
                    <QuizResult />
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
                <Route path="/teacher/ai-generate" element={
                  <PrivateRoute allowedRoles={['teacher', 'admin']}>
                    <AIQuestionGen />
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