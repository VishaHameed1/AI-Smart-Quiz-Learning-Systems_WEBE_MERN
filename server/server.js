const connectDB = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
    if (!MONGODB_URI) {
        console.error('❌ Error: MONGODB_URI is not defined in .env file');
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
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

        // Schedule automatic cleanup every Sunday at 2 AM
        cron.schedule('0 2 * * 0', async () => {
            console.log('🧹 Running scheduled database cleanup...');
            try {
                const result = await cleanupService.runFullCleanup();
                console.log('✅ Cleanup completed:', result.message);
            } catch (error) {
                console.error('❌ Scheduled cleanup failed:', error.message);
            }
        });

        console.log('\n⏰ Scheduled tasks:');
        console.log('   Database cleanup: Every Sunday at 2:00 AM');
    });
};

// Schedule weekly cleanup on Sundays at 2:00 AM (with error handling)
try {
    const cron = require('node-cron');
    // Check if cleanupController exists before using it
    let cleanupController;
    try {
        cleanupController = require('./controllers/cleanupController');
    } catch (err) {
        console.log('⚠️ Cleanup controller not available, skipping scheduled cleanup');
    }
    
    if (cleanupController && cron) {
        cron.schedule('0 2 * * 0', async () => {
            console.log('Running scheduled cleanup...');
            try {
                await cleanupController.fullCleanup({ body: {} }, { json: () => {} });
            } catch (err) {
                console.error('Scheduled cleanup failed:', err);
            }
        });
    }
} catch (err) {
    console.log('ℹ️ Cron scheduling not available (node-cron not installed)');
}

if (process.env.NODE_ENV !== 'test') {
    startServer().catch(err => {
        console.error('❌ Server failed to start:', err.message);
        process.exit(1);
    });
}

module.exports = app;