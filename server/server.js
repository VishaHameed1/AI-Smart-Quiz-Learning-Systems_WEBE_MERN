const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan'); // Logging ke liye (optional but recommended)
require('dotenv').config();

// Middleware aur Routes import karein
const { auth } = require('./middleware/auth'); // Aapka updated auth middleware
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adaptiveRoutes = require('./routes/adaptiveRoutes');

const app = express();

// --- 1. Security & Optimization Middleware ---
app.use(helmet()); 
app.use(compression()); 
app.use(cors()); 
app.use(morgan('dev')); // Terminal mein requests track karne ke liye
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 2. API Welcome & Health Routes ---
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to AI Quiz System API',
        version: '1.0.0',
        student: 'Visha Hameed', //
        status: 'Active'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is healthy and running!' });
});

// --- 3. Functional Routes ---
// Note: 'auth' ko yahan middleware ke taur par globally ya route-specific use kar sakte hain
app.use('/api/quizzes', auth, quizRoutes);
app.use('/api/questions', auth, questionRoutes);
app.use('/api/attempts', auth, attemptRoutes);
app.use('/api/ai', auth, aiRoutes);
app.use('/api/adaptive', auth, adaptiveRoutes);

// --- 4. 404 & Error Handling ---
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

// --- 5. Database Connection & Startup ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; // Ensure this is set in your .env

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
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});