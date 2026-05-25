require('dotenv').config();
const connectDB = require('./config/database');
const app = require('./app');
const cron = require('node-cron');
const cleanupController = require('./controllers/cleanupController');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const startServer = async () => {
    // Check for critical environment variables
    const requiredEnv = { MONGODB_URI, JWT_SECRET, GROQ_API_KEY };
    const missing = Object.keys(requiredEnv).filter(key => !requiredEnv[key]);

    if (missing.length > 0) {
        console.error(`❌ Error: Missing required environment variables: ${missing.join(', ')}`);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }

    if (process.env.NODE_ENV === 'test' && !MONGODB_URI) {
        console.warn('⚠️ Running in test mode without a MongoDB connection.');
    }

    if (MONGODB_URI) {
        await connectDB();
    }

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
        console.log(`   GET  /api/review/due/count - Get due reviews count`);

        console.log('\n⏰ Scheduled tasks:');
        console.log('   Database cleanup: Every Sunday at 2:00 AM');
    });
};

// Schedule weekly cleanup on Sundays at 2:00 AM (with error handling)
if (cron && cleanupController) {
    cron.schedule('0 2 * * 0', async () => {
        console.log('Running scheduled cleanup...');
        try {
            // Call runFullCleanup with mock req/res objects
            const mockRes = { json: (data) => console.log('Cleanup Result:', data) };
            await cleanupController.fullCleanup({ body: {} }, mockRes);
        } catch (err) {
            console.error('Scheduled cleanup failed:', err);
        }
    });
}

if (process.env.NODE_ENV !== 'test') {
    startServer().catch(err => {
        console.error('❌ Server failed to start:', err.message);
        process.exit(1);
    });
}

module.exports = app;