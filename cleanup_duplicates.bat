@echo off
echo ====================================================
echo AI Smart Quiz System - Redundant File Cleanup
echo ====================================================
echo.

:: 1. Remove React Components incorrectly placed in the server directory
echo Removing React components from server directory...
if exist "server\middleware\AuthContext.jsx" del /f "server\middleware\AuthContext.jsx"
if exist "server\middleware\TeacherOnboarding.jsx" del /f "server\middleware\TeacherOnboarding.jsx"
if exist "server\middleware\PrivateRoute.jsx" del /f "server\middleware\PrivateRoute.jsx"
if exist "server\controllers\TeacherOnboarding.jsx" del /f "server\controllers\TeacherOnboarding.jsx"
if exist "server\middleware\RoleSelection.jsx" del /f "server\middleware\RoleSelection.jsx"
if exist "server\middleware\AdminOnboarding.jsx" del /f "server\middleware\AdminOnboarding.jsx"
if exist "server\controllers\AdminOnboarding.jsx" del /f "server\controllers\AdminOnboarding.jsx"
if exist "server\controllers\TeacherQuizzes.jsx" del /f "server\controllers\TeacherQuizzes.jsx"
if exist "server\controllers\QuizPaperGenerator.jsx" del /f "server\controllers\QuizPaperGenerator.jsx"

:: 2. Remove consolidated Backend controllers/models (using old naming convention)
echo Removing consolidated backend logic...
if exist "server\controllers\authController.js" del /f "server\controllers\authController.js"
if exist "server\controllers\teacherController.js" del /f "server\controllers\teacherController.js"
if exist "server\controllers\userController.js" del /f "server\controllers\userController.js"
if exist "server\models\User.model.js" del /f "server\models\User.model.js"

:: 3. Remove backend files and redundant configs from the client directory
echo Removing redundant client-side files...
if exist "client\src\components\common\analyticsController.js" del /f "client\src\components\common\analyticsController.js"
if exist "client\src\pages\teacher\teacherRoutes.js" del /f "client\src\pages\teacher\teacherRoutes.js"
if exist "client\src\pages\teacher\Quiz.js" del /f "client\src\pages\teacher\Quiz.js"
if exist "client\src\pages\teacher\TeacherDashboard.jsx" del /f "client\src\pages\teacher\TeacherDashboard.jsx"
if exist "client\src\store\api.js" del /f "client\src\store\api.js"
if exist "client\src\index.jsx" del /f "client\src\index.jsx"

:: 4. Remove misplaced enrollment and folder feature files
echo Removing misplaced enrollment and folder feature files...
if exist "server\routes\Folder.model.js" del /f "server\routes\Folder.model.js"
if exist "server\routes\Enrollment.model.js" del /f "server\routes\Enrollment.model.js"
if exist "server\controllers\gamification.routes.js" del /f "server\controllers\gamification.routes.js"
if exist "server\controllers\progress.routes.js" del /f "server\controllers\progress.routes.js"
if exist "server\controllers\review.routes.js" del /f "server\controllers\review.routes.js"
if exist "server\controllers\Gamification.model.js" del /f "server\controllers\Gamification.model.js"
if exist "server\controllers\ReviewQueue.model.js" del /f "server\controllers\ReviewQueue.model.js"
if exist "client\src\pages\student\reviewController.js" del /f "client\src\pages\student\reviewController.js"
if exist "server\routes\studentFolder.controller.js" del /f "server\routes\studentFolder.controller.js"
if exist "server\routes\EnrollmentRequests.jsx" del /f "server\routes\EnrollmentRequests.jsx"
if exist "server\routes\TeacherFolders.jsx" del /f "server\routes\TeacherFolders.jsx"
if exist "server\routes\TeachersList.jsx" del /f "server\routes\TeachersList.jsx"
if exist "client\src\pages\teacher\Enrollment.model.js" del /f "client\src\pages\teacher\Enrollment.model.js"
if exist "client\src\pages\teacher\studentEnrollment.controller.js" del /f "client\src\pages\teacher\studentEnrollment.controller.js"
if exist "client\src\pages\teacher\studentEnrollment.routes.js" del /f "client\src\pages\teacher\studentEnrollment.routes.js"
if exist "client\src\pages\student\emailService.js" del /f "client\src\pages\student\emailService.js"
if exist "client\src\QuizList.jsx" del /f "client\src\QuizList.jsx"

echo.
echo [SUCCESS] Project cleanup complete. Redundant files removed.
pause