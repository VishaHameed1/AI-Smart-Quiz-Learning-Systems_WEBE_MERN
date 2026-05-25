const path = require('path');
const dotenvPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: dotenvPath });
const mongoose = require('mongoose');
const ReviewQueue = require('../models/ReviewQueue.model');
const User = require('../models/User');
const Question = require('../models/Question');

const seedReviews = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in environment');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB for seeding reviews');

    const students = await User.find({ role: 'student' });
    const questions = await Question.find().limit(5); // Get some questions to link

    if (students.length === 0 || questions.length === 0) {
      console.error('❌ Need students and questions in DB to seed reviews.');
      console.error('Please ensure you have run `npm run seed` first.');
      process.exit(1);
    }

    // Clear existing reviews for these students to prevent duplicates on re-run
    const studentIds = students.map(s => s._id);
    await ReviewQueue.deleteMany({ userId: { $in: studentIds } });

    const reviewData = [];
    students.forEach(student => {
      questions.forEach((q, index) => {
        reviewData.push({
          userId: student._id,
          questionId: q._id,
          nextReviewDate: new Date(), // Set to NOW so they appear in navbar immediately
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          topic: q.topic || 'General'
        });
      });
    });

    await ReviewQueue.insertMany(reviewData);

    console.log(`🚀 Successfully seeded Review Queue for ${students.length} students.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedReviews();