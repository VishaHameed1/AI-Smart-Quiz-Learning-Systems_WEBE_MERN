const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adaptiveRoutes = require('./routes/adaptiveRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const progressRoutes = require('./routes/progressRoutes');
const cleanupRoutes = require('./routes/cleanupRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AI Quiz System API',
    version: '1.0.0',
    status: 'Active'
  }); 
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy and running!' });
});

app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/adaptive', adaptiveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/cleanup', cleanupRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

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

module.exports = app;
