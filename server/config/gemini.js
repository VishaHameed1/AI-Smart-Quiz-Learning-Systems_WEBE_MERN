const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper function to create a mock model (for testing)
const createMockModel = () => ({
  generateContent: async () => ({
    response: {
      text: () => JSON.stringify([{ /* ... mock question ... */ }])
    }
  })
});

let genAI;
let model;
let fastModel;

// **IMPORTANT: Ab hum naye, available models use karenge**
// Aap 'gemini-2.0-flash-exp' ya 'gemini-2.5-flash' try kar sakte hain. Main 'gemini-2.0-flash-exp' use kar raha hoon.
const ACTIVE_MODEL_NAME = 'gemini-2.0-flash-exp';

if (process.env.NODE_ENV === 'test') {
  model = createMockModel();
  fastModel = createMockModel();
} else {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY must be defined in .env');
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Updated model for general tasks
  model = genAI.getGenerativeModel({
    model: ACTIVE_MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  // Updated model for faster tasks
  fastModel = genAI.getGenerativeModel({
    model: ACTIVE_MODEL_NAME,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1024,
    },
  });
}

module.exports = { genAI, model, fastModel };