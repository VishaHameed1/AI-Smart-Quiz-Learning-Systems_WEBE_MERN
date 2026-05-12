const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// ========== MIDDLEWARE ==========
const { auth } = require('./middleware/auth');
// ========== PERSON A ROUTES (Quiz Core) ==========
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adaptiveRoutes = require('./routes/adaptiveRoutes');

// ========== PERSON B ROUTES (User & Learning System) ==========
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const progressRoutes = require('./routes/progress.routes');
const reviewRoutes = require('./routes/review.routes');
const gamificationRoutes = require('./routes/gamification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const teacherRoutes = require('./routes/teacher.routes');

const app = express();

// --- 1. Security & Optimization Middleware ---
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. API Welcome & Health Routes (Public) ---
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to AI Quiz System API',
        version: '2.0.0',
        modules: {
            personA: 'Quiz Core, AI Generation, Adaptive Difficulty',
            personB: 'Authentication, Dashboard, Progress, Spaced Repetition'
        },
        status: 'Active'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is healthy and running!' });
});

// ========== 3. PUBLIC ROUTES (No Auth Required) ==========
app.use('/api/auth', authRoutes);

// ========== 4. PROTECTED ROUTES (Auth Required) ==========
// Person A Routes (Quiz Core)
app.use('/api/quizzes', auth, quizRoutes);
app.use('/api/questions', auth, questionRoutes);
app.use('/api/attempts', auth, attemptRoutes);
app.use('/api/ai', auth, aiRoutes);
app.use('/api/adaptive', auth, adaptiveRoutes);

// Person B Routes (User & Learning System)
app.use('/api/users', auth, userRoutes);
app.use('/api/progress', auth, progressRoutes);
app.use('/api/review', auth, reviewRoutes);
app.use('/api/gamification', auth, gamificationRoutes);
app.use('/api/dashboard', auth, dashboardRoutes);
app.use('/api/teacher', auth, teacherRoutes);

// --- 5. 404 & Error Handling ---
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error('Internal Server Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Something went wrong on the server' 
    });
});

// --- 6. Database Connection & Startup ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 API live at: http://localhost:${PORT}/api`);
        console.log(`\n📋 Available API Endpoints:`);
        console.log(`   GET  /api/health - Health check`);
        console.log(`   POST /api/auth/register - User registration`);
        console.log(`   POST /api/auth/login - User login`);
        console.log(`   GET  /api/quizzes - Get all quizzes`);
        console.log(`   GET  /api/users/profile - Get user profile`);
        console.log(`   GET  /api/progress - Get learning progress`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});