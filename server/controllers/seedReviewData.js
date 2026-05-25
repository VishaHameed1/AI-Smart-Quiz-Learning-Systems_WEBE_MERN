const path = require('path');
const dotenvPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: dotenvPath });
const mongoose = require('mongoose');
const ReviewQueue = require('../models/ReviewQueue.model');
const User = require('../models/User');
const Question = require('../models/Question');

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found in environment');
  await mongoose.connect(uri);
  const students = await User.find({ role: 'student' });
  const questions = await Question.find().limit(5);

  if (students.length === 0 || questions.length === 0) {
    console.error('❌ Need students and questions to seed.');
    process.exit(1);
  }

  const reviews = [];
  students.forEach(student => {
    questions.forEach(q => {
      reviews.push({
        userId: student._id,
        questionId: q._id,
        nextReviewDate: new Date(),
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0
      });
    });
  });

  await ReviewQueue.insertMany(reviews);
  console.log(`✅ Review data seeded for ${students.length} students.`);
  process.exit();
};
seed();