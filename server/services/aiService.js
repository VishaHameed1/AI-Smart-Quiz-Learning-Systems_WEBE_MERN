const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

class AIService {
  // Generate questions with retry logic
  static async generateQuestionsWithRetry(prompt, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
        });
        const text = completion.choices[0]?.message?.content;
        
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(text);
      } catch (error) {
        console.log(`Attempt ${i + 1} failed:`, error.message);
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Wait before retry
      }
    }
  }
  
  // Estimate question difficulty using AI
  static async estimateDifficulty(questionText) {
    const prompt = `Rate the difficulty of this question from 1-10 (1=easy, 10=expert): 
    "${questionText}"
    
    Return only a number between 1-10.`;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      const text = completion.choices[0]?.message?.content;
      const rating = parseInt(text.trim());
      return Math.min(10, Math.max(1, rating || 5));
    } catch (error) {
      console.error('Difficulty estimation failed:', error);
      return 5; // Default medium difficulty
    }
  }
  
  // Generate hint for question
  static async generateHint(questionText, correctAnswer) {
    const prompt = `Generate a helpful hint (not giving away the full answer) for this question:
    
    Question: ${questionText}
    Correct Answer: ${correctAnswer}
    
    Provide a hint that guides the student toward the correct answer.
    Keep it under 50 words.`;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      const text = completion.choices[0]?.message?.content;
      return text.trim();
    } catch (error) {
      return "Think carefully about the key concepts in this topic.";
    }
  }
  
  // Generate quiz recommendations
  static async getRecommendations(userPerformance) {
    const prompt = `Based on user's quiz performance: ${JSON.stringify(userPerformance)}
    
    Recommend 3 topics the user should focus on next.
    Return as JSON: {"recommendations": ["topic1", "topic2", "topic3"]}`;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { recommendations: [] };
    } catch (error) {
      return { recommendations: [] };
    }
  }
}

module.exports = AIService;