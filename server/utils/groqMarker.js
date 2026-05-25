const { Groq } = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Scores a theoretical answer based on relevance using AI.
 * @param {string} question - The original question text.
 * @param {string} studentAnswer - The answer written by the student.
 * @param {string} correctAnswer - The reference answer from the teacher.
 * @param {number} maxMarks - Total marks for this question.
 */
const scoreTheoreticalAnswer = async (question, studentAnswer, correctAnswer, maxMarks) => {
  try {
    const prompt = `
      Task: Grade a student's theoretical answer based on a reference answer.
      Question: "${question}"
      Reference Answer: "${correctAnswer}"
      Student's Answer: "${studentAnswer}"
      Max Marks: ${maxMarks}

      Instruction: Evaluate the relevance and accuracy. Assign a score between 0 and ${maxMarks}. 
      Respond ONLY with a JSON object: {"score": number, "explanation": "brief reason"}.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result; // returns { score: X, explanation: "..." }
  } catch (error) {
    console.error("AI Marking Error:", error);
    // Fallback: simple inclusion check if AI fails
    const isRelevant = studentAnswer.toLowerCase().includes(correctAnswer.toLowerCase().split(' ')[0]);
    return { score: isRelevant ? maxMarks / 2 : 0, explanation: "Fallback scoring applied." };
  }
};

module.exports = { scoreTheoreticalAnswer };