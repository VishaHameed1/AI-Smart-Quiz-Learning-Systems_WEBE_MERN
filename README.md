
# 🧠 AI Smart Quiz System - Person A (Quiz & AI Core)

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Project Overview

AI Smart Quiz System is an intelligent, adaptive quiz platform that uses **Google Gemini AI** to generate dynamic questions and adjust difficulty based on user performance. This repository contains **different modules** - Quiz Core, AI Question Generation, Adaptive Difficulty, and Analytics.

### 👥 Project Team

| Person | Role | Modules |
|--------|------|---------|
| **Visha Hameed** | Person A | Quiz Core, AI Generation, Adaptive Difficulty, Analytics |
| **Hadiqa Ehsan** | Person B | Authentication, User Dashboard, Progress Tracking, Spaced Repetition |

## ✨ Features (Person A)

### 🎯 Quiz Management
- ✅ Create, Read, Update, Delete quizzes
- ✅ Multiple quiz types (Timed, Practice, Adaptive, Competitive)
- ✅ Question bank management
- ✅ Bulk question upload (JSON/CSV)
- ✅ Duplicate quiz functionality

### 🤖 AI Question Generation (Google Gemini)
- ✅ Generate questions from topic name
- ✅ Generate questions from text/PDF content
- ✅ Generate questions from URL
- ✅ AI-powered answer explanations
- ✅ Question improvement (clarify, expand, simplify)
- ✅ Flashcard generation from topics
- ✅ **Free API access** - No credit card required

### 📊 Adaptive Difficulty
- ✅ Elo rating system for questions
- ✅ Dynamic difficulty adjustment
- ✅ Performance-based question selection
- ✅ Skill level tracking
- ✅ Personalized learning path

### 📈 Quiz Analytics
- ✅ Real-time score calculation
- ✅ Question-wise performance breakdown
- ✅ Topic mastery tracking
- ✅ Time tracking per question
- ✅ Export results as PDF/CSV

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **AI/ML** | Google Gemini API (Free) |
| **Frontend** | React 18, Tailwind CSS |
| **State Management** | Context API, Redux Toolkit |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Authentication** | JWT (shared with Person B) |

## 📁 Project Structure

```
ai-quiz-system-person-a/
├── server/
│   ├── models/
│   │   ├── Quiz.js              # Quiz schema
│   │   ├── Question.js          # Question schema
│   │   ├── Attempt.js           # Attempt schema
│   │   ├── User.model.js        # User schema (Person B)
│   │   ├── Progress.model.js    # Progress tracking (Person B)
│   │   ├── ReviewQueue.model.js # Spaced repetition (Person B)
│   │   └── AIQuestionCache.js   # AI response cache
│   ├── controllers/
│   │   ├── quizController.js    # Quiz CRUD
│   │   ├── questionController.js# Question management
│   │   ├── attemptController.js # Quiz taking
│   │   ├── aiController.js      # Gemini AI integration
│   │   ├── adaptiveController.js# Adaptive logic
│   │   ├── auth.controller.js   # Authentication (Person B)
│   │   └── user.controller.js   # User management (Person B)
│   ├── routes/
│   │   ├── quizRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── attemptRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── adaptiveRoutes.js
│   │   ├── auth.routes.js       # Auth routes (Person B)
│   │   └── user.routes.js       # User routes (Person B)
│   ├── middleware/
│   │   ├── auth.js              # JWT auth
│   │   ├── auth.middleware.js   # Auth middleware (Person B)
│   │   └── validation.js        # Input validation
│   ├── utils/
│   │   ├── constants.js
│   │   ├── adaptiveAlgorithm.js # Elo rating system
│   │   └── validators.js
│   └── config/
│       ├── database.js
│       └── gemini.js            # Gemini API config
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   │   ├── QuizList.jsx
│   │   │   │   ├── TakeQuiz.jsx
│   │   │   │   └── QuizResult.jsx
│   │   │   ├── teacher/
│   │   │   │   ├── CreateQuiz.jsx
│   │   │   │   ├── ManageQuestions.jsx
│   │   │   │   └── AIQuestionGen.jsx
│   │   │   ├── LoginPage.jsx    (Person B)
│   │   │   ├── RegisterPage.jsx (Person B)
│   │   │   └── DashboardPage.jsx (Person B)
│   │   ├── components/
│   │   │   ├── quiz/
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   ├── Timer.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   └── ResultChart.jsx
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   └── forms/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  (Person B)
│   │   │   └── QuizContext.jsx
│   │   ├── hooks/
│   │   │   ├── useTimer.js
│   │   │   ├── useAdaptiveQuiz.js
│   │   │   └── useAuth.js       (Person B)
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── progressSlice.js
│   │   └── services/
│   │       ├── api.js
│   │       ├── quizService.js
│   │       └── aiService.js
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── Dockerfile
└── .env
```

## 🚀 Installation Guide

### Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | 18.x or higher | [Download](https://nodejs.org/) |
| MongoDB | 6.0 or higher | [Download](https://www.mongodb.com/try/download/community) |
| Git | Latest | [Download](https://git-scm.com/downloads) |
| Docker (Optional) | 20.10+ | [Download](https://www.docker.com/) |

### Step 1: Get Gemini API Key (FREE)

```bash
# 1. Go to Google AI Studio
https://aistudio.google.com/

# 2. Sign in with Google account
# 3. Click "Get API Key"
# 4. Click "Create API Key"
# 5. Copy your key (starts with AIza...)
```

**⚠️ Note:** Gemini API is completely free! No credit card required.

### Step 2: Clone & Install

```bash
# Clone repository
git clone https://github.com/VishaHameed1/AI-Smart-Quiz-Learning-Systems_WEBE_MERN.git
cd AI-Smart-Quiz-Learning-Systems_WEBE_MERN

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Environment Setup

Create `.env` file in `server` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-quiz-system

# JWT Secret (shared with Person B)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Google Gemini API (FREE)
GEMINI_API_KEY=your-gemini-api-key-here

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Step 4: Run the Application

```bash
# Terminal 1 - Start MongoDB (using Docker)
docker run -d --name mongodb -p 27017:27017 mongo:6.0

# Terminal 2 - Start Backend
cd server
npm run dev

# Terminal 3 - Start Frontend
cd client
npm run dev
```

### Step 5: Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:5000/api | - |
| **MongoDB** | mongodb://localhost:27017 | - |
| **MongoDB Express** | http://localhost:8081 | admin/admin123 |

## 📡 API Endpoints (Person A)

### Quiz APIs
```javascript
POST   /api/quizzes/create          // Create new quiz
GET    /api/quizzes                 // Get all quizzes
GET    /api/quizzes/:id             // Get quiz by ID
PUT    /api/quizzes/:id             // Update quiz
DELETE /api/quizzes/:id             // Delete quiz
POST   /api/quizzes/:id/duplicate   // Duplicate quiz
```

### Question APIs
```javascript
POST   /api/questions/quiz/:quizId/add      // Add single question
POST   /api/questions/quiz/:quizId/bulk     // Bulk upload questions
PUT    /api/questions/:id                   // Update question
DELETE /api/questions/:id                   // Delete question
GET    /api/questions/topic/:topic          // Get questions by topic
```

### Attempt APIs
```javascript
POST   /api/attempts/quiz/:quizId/start     // Start quiz
POST   /api/attempts/:attemptId/submit-answer  // Submit answer
POST   /api/attempts/:attemptId/complete    // Complete quiz
GET    /api/attempts/:attemptId/results     // Get results
GET    /api/attempts/user/my-attempts       // Get user attempts
```

### AI APIs (Gemini - FREE)
```javascript
POST   /api/ai/generate-questions      // Generate from topic
POST   /api/ai/generate-from-text      // Generate from text
POST   /api/ai/generate-from-url       // Generate from URL
POST   /api/ai/improve/:questionId     // Improve question
POST   /api/ai/explain-answer          // Explain answer
POST   /api/ai/quiz-summary            // Generate summary
POST   /api/ai/generate-flashcards     // Generate flashcards
```

### Adaptive APIs
```javascript
POST   /api/adaptive/attempt/:attemptId/next     // Get next question
GET    /api/adaptive/user/:userId/skill-level    // Get skill level
PUT    /api/adaptive/question/:questionId/difficulty  // Update difficulty
```

## 🐳 Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔄 Integration with Person B

Person A's APIs expect JWT token from Person B:

```javascript
// In all API calls, include token in headers
headers: {
  'Authorization': `Bearer ${token}`
}
```

### API Endpoints from Person B

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/progress` | Get learning progress |

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Test API with Thunder Client (VS Code extension)
# Or use curl:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}'
```

## 📊 API Response Examples

### Generate Questions Response (Gemini)
```json
{
  "success": true,
  "message": "5 questions generated successfully",
  "data": [
    {
      "question": "What is JavaScript?",
      "options": ["A programming language", "A coffee brand", "A database", "An operating system"],
      "correctAnswer": "A programming language",
      "explanation": "JavaScript is a programming language used for web development.",
      "difficulty": "medium",
      "topic": "Programming",
      "aiGenerated": true
    }
  ],
  "source": "gemini-ai"
}
```

### Quiz Submit Response
```json
{
  "success": true,
  "data": {
    "score": 8,
    "percentageScore": 80,
    "passed": true,
    "earnedPoints": 80,
    "topicMastery": {
      "JavaScript": 85,
      "React": 75
    }
  }
}
```

## 🔧 Troubleshooting

### Gemini API Error
```bash
Error: API key not valid
Solution: 
1. Go to https://aistudio.google.com/
2. Generate new API key
3. Update .env file
```

### MongoDB Connection Error
```bash
Error: MongooseServerSelectionError
Solution: 
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Docker
docker run -d --name mongodb -p 27017:27017 mongo:6.0
```

### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::5000
Solution: 
# Change PORT in .env file
PORT=5001

# OR kill process using the port
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```

### 401 Unauthorized Error
```bash
Error: Please authenticate
Solution:
1. Make sure you're logged in
2. Check if token is in localStorage
3. Verify JWT_SECRET matches between Person A and Person B
4. Token might be expired, login again
```

## 📈 Future Enhancements

- [ ] Real-time multiplayer quizzes
- [ ] Voice-based question answering
- [ ] Image-based question generation
- [ ] Integration with YouTube for video-based questions
- [ ] Advanced analytics dashboard with D3.js
- [ ] Mobile app (React Native)
- [ ] Offline quiz mode
- [ ] Social sharing of quiz results

## 🤝 Integration with Person B

**Person B (Hadiqa Ehsan)** is responsible for:
- 🔐 User authentication & authorization
- 👤 User profiles & dashboards
- 📊 Progress tracking & history
- 🔄 Spaced repetition system
- 📧 Notifications & email
- 🎮 Gamification & leaderboards

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - Free API access for question generation
- **MongoDB Atlas** - Database hosting (optional)
- **Open Source Community** - For amazing libraries
- **Institute of Space and Technology, Islamabad** - Institutional Support

## 📞 Contact

| Person | Role | Contact |
|--------|------|---------|
| **Visha Hameed** | Person A | vishahameed666@gmail.com |
| **Hadiqa Ehsan** | Person B | hadiqaehsan111@gmail.com |

---

**Made with ❤️ by Visha Hameed & Hadiqa Ehsan | AI Smart Quiz System**

*Last Updated: May 2024*
```

---

## ✅ Key Updates Made:

| Section | Change |
|---------|--------|
| Project Overview | Added team division table |
| Tech Stack | Added Redux Toolkit |
| Project Structure | Added Person B files |
| Installation | Added Docker MongoDB command |
| API Endpoints | Added Person B endpoints |
| Troubleshooting | Added 401 error solution |
| Contact | Added both team members |
| Acknowledgments | Added supervisor and university |

