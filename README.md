
# 🧠 AI Smart Quiz System - Person A (Quiz & AI Core)

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Project Overview

AI Smart Quiz System is an intelligent, adaptive quiz platform that uses **Google Gemini AI** to generate dynamic questions and adjust difficulty based on user performance. This repository contains **Person A's modules** - Quiz Core, AI Question Generation, Adaptive Difficulty, and Analytics.

## ✨ Features (Person A)

### 🎯 Quiz Management
- ✅ Create, Read, Update, Delete quizzes
- ✅ Multiple quiz types (Timed, Practice, Adaptive, Competitive)
- ✅ Question bank management
- ✅ Bulk question upload (JSON/CSV)
- ✅ Duplicate quiz functionality

### 🤖 AI Question Generation
- ✅ Generate questions from topic name
- ✅ Generate questions from text/PDF content
- ✅ Generate questions from URL
- ✅ AI-powered answer explanations
- ✅ Question improvement (clarify, expand, simplify)
- ✅ Flashcard generation from topics

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
| **AI/ML** | Google Gemini API |
| **Frontend** | React 18, Tailwind CSS |
| **State Management** | Context API, useReducer |
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
│   │   └── AIQuestionCache.js   # AI response cache
│   ├── controllers/
│   │   ├── quizController.js    # Quiz CRUD
│   │   ├── questionController.js# Question management
│   │   ├── attemptController.js # Quiz taking
│   │   ├── aiController.js      # Gemini AI integration
│   │   └── adaptiveController.js# Adaptive logic
│   ├── routes/
│   │   ├── quizRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── attemptRoutes.js
│   │   ├── aiRoutes.js
│   │   └── adaptiveRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT auth
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
│   │   │   └── teacher/
│   │   │       ├── CreateQuiz.jsx
│   │   │       ├── ManageQuestions.jsx
│   │   │       └── AIQuestionGen.jsx
│   │   ├── components/
│   │   │   ├── quiz/
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   ├── Timer.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   └── ResultChart.jsx
│   │   │   └── forms/
│   │   ├── context/
│   │   │   └── QuizContext.jsx
│   │   ├── hooks/
│   │   │   ├── useTimer.js
│   │   │   └── useAdaptiveQuiz.js
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

### Step 1: Get Gemini API Key (FREE)

```bash
# 1. Go to Google AI Studio
https://aistudio.google.com/

# 2. Sign in with Google account
# 3. Click "Get API Key"
# 4. Click "Create API Key"
# 5. Copy your key (starts with AIza...)
```

### Step 2: Clone & Install

```bash
# Clone repository
git clone https://github.com/your-repo/ai-quiz-system-person-a.git
cd ai-quiz-system-person-a

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

# JWT (same as Person B)
JWT_SECRET=your-super-secret-jwt-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Step 4: Run the Application

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **MongoDB:** mongodb://localhost:27017

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

### AI APIs (Gemini)
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

### Shared User Model (from Person B)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  role: 'student' | 'teacher' | 'admin'
}
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📊 API Response Examples

### Generate Questions Response
```json
{
  "success": true,
  "data": [
    {
      "question": "What is JavaScript?",
      "options": ["A programming language", "A coffee brand", "A database", "An operating system"],
      "correctAnswer": "A programming language",
      "explanation": "JavaScript is a programming language used for web development.",
      "difficulty": "medium",
      "topic": "Programming"
    }
  ]
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
Solution: Regenerate API key from Google AI Studio
```

### MongoDB Connection Error
```bash
Error: MongooseServerSelectionError
Solution: Ensure MongoDB is running: `net start MongoDB` (Windows) or `sudo systemctl start mongod` (Linux)
```

### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::5000
Solution: Change PORT in .env file or kill process using the port
```

## 📈 Future Enhancements

- [ ] Real-time multiplayer quizzes
- [ ] Voice-based question answering
- [ ] Image-based question generation
- [ ] Integration with YouTube for video-based questions
- [ ] Advanced analytics dashboard with D3.js
- [ ] Mobile app (React Native)

## 🤝 Integration with Person B

Person B is responsible for:
- User authentication & authorization
- User profiles & dashboards
- Progress tracking & history
- Spaced repetition system
- Notifications & email

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for free API access
- MongoDB Atlas for database hosting
- Open source community

---

**Made with ❤️ by Person A | AI Smart Quiz System**

*Last Updated: May 2024*
