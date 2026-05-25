const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Gamification = require('../models/Gamification.model');
const Folder = require('../models/Folder.model');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const usersToSeed = [
  // Teachers
  { name: 'Teacher One', email: 'teacher1@gmail.com', password: '123456', role: 'teacher', onboardingCompleted: true },
  { name: 'Teacher Two', email: 'teacher2@gmail.com', password: '123456', role: 'teacher', onboardingCompleted: true },
  { name: 'Teacher Three', email: 'teacher3@gmail.com', password: '123456', role: 'teacher', onboardingCompleted: true },
  // Students
  { name: 'Student One', email: 'student1@gmail.com', password: '123456', role: 'student', onboardingCompleted: true },
  { name: 'Student Two', email: 'student2@gmail.com', password: '123456', role: 'student', onboardingCompleted: true },
  { name: 'Student Three', email: 'student3@gmail.com', password: '123456', role: 'student', onboardingCompleted: true },
];

const seedUsers = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const createdTeachers = [];

    for (const userData of usersToSeed) {
      // Check if user already exists
      let user = await User.findOne({ email: userData.email });
      
      if (user) {
        console.log(`ℹ️ User ${userData.email} already exists, skipping...`);
        if (user.role === 'teacher') createdTeachers.push(user);
        continue;
      }

      // Create User
      user = await User.create(userData);
      console.log(`🚀 Created ${userData.role}: ${userData.email}`);

      // Create associated Gamification profile
      const gamificationExists = await Gamification.findOne({ userId: user._id });
      if (!gamificationExists) {
        await Gamification.create({ 
          userId: user._id,
          totalXp: 0,
          level: 1,
          currentStreak: 0
        });
        console.log(`  📊 Created gamification profile for ${userData.email}`);
      }

      if (user.role === 'teacher') createdTeachers.push(user);
    }

    console.log('\n📂 Starting Content Seeding (Folders -> Quizzes -> Questions)...');

    const quizTypes = ['competitive', 'practice', 'timed'];
    const difficulties = ['easy', 'medium', 'hard'];

    for (const teacher of createdTeachers) {
      console.log(`\n👨‍🏫 Seeding content for: ${teacher.email}`);
      
      for (let f = 1; f <= 3; f++) {
        // 1. Create Folder
        const folder = await Folder.create({
          name: `Folder ${f} - ${teacher.name.split(' ')[1]}`,
          description: `Educational materials and assessments for module ${f}`,
          createdBy: teacher._id,
          quizzes: [],
          allowedUsers: []
        });
        console.log(`   📁 Created Folder: ${folder.name}`);

        for (let q = 1; q <= 3; q++) {
          const type = quizTypes[(q - 1) % quizTypes.length];
          const difficulty = difficulties[(q - 1) % difficulties.length];

          // 2. Create Quiz
          const quiz = await Quiz.create({
            title: `${type.toUpperCase()} Quiz ${q} (${folder.name})`,
            description: `A comprehensive ${difficulty} level assessment covering core concepts.`,
            type: type,
            difficulty: difficulty,
            createdBy: teacher._id,
            isPublished: true,
            isPublic: false,           // Private by default
            requiresEnrollment: true,  // Must request access
            duration: 5,               // Default 5 mins
            totalQuestions: 5,
            passingScore: 60
          });

          // Link quiz to folder
          folder.quizzes.push(quiz._id);

          // 3. Create 5 Questions per quiz
          const questionsData = [];
          for (let i = 1; i <= 5; i++) {
            const isTheoretical = i === 5; // Make the 5th question theoretical
            questionsData.push({
              quizId: quiz._id,
              createdBy: teacher._id,
              text: isTheoretical 
                ? `Explain the fundamental logic behind concept #${i} in this topic.`
                : `Identify the correct characteristic of element #${i}.`,
              type: isTheoretical ? 'theoretical' : 'mcq',
              options: isTheoretical ? [] : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: isTheoretical ? 'Model answer emphasizing key logical steps.' : 'Option A',
              explanation: 'Detailed reasoning for the correct response.',
              difficulty: difficulty,
              topic: 'General Knowledge',
              points: isTheoretical ? 10 : 2
            });
          }
          
          await Question.insertMany(questionsData);
          console.log(`      📝 Created Quiz: ${quiz.title} with 5 questions`);
        }
        await folder.save();
      }
    }

    console.log('\n✨ Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedUsers();