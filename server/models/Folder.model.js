const mongoose = require('mongoose');
const Enrollment = require('./Enrollment.model');

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  }],
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

FolderSchema.post('save', async function(doc) {
  try {
    const { quizzes, allowedUsers } = doc;
    
    // Create enrollment records for every student in the folder for every quiz in the folder
    const enrollmentPromises = [];
    
    for (const studentId of allowedUsers) {
      for (const quizId of quizzes) {
        enrollmentPromises.push(
          Enrollment.findOneAndUpdate(
            { student: studentId, quiz: quizId },
            { status: 'accepted', respondedAt: new Date(), respondedBy: doc.createdBy },
            { upsert: true, new: true }
          )
        );
      }
    }
    await Promise.all(enrollmentPromises);
  } catch (error) {
    console.error("Automatic Enrollment Sync Error:", error);
  }
});

module.exports = mongoose.model('Folder', FolderSchema);