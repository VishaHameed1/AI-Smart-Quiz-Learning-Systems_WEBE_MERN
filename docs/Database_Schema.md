# Database Schema

## Quiz Collection
- title: String
- description: String
- duration: Number
- passingScore: Number
- difficulty: String

## Question Collection
- quizId: ObjectId
- text: String
- options: [String]
- correctAnswer: Mixed
- explanation: String
- difficulty: String
- topic: String

## Attempt Collection
- userId: ObjectId
- quizId: ObjectId
- answers: Array
- score: Number
- percentageScore: Number
