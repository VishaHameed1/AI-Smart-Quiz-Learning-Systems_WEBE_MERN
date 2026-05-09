const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model (Gemini Pro for text, Gemini Pro Vision for images)
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 0.8,
    maxOutputTokens: 2048,
  },
});

// For faster responses (lighter model)
const fastModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.5,
    maxOutputTokens: 1024,
  },
});

module.exports = { genAI, model, fastModel };