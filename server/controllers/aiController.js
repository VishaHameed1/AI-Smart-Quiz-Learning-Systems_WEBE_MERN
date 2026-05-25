const Groq = require('groq-sdk');
const Question = require('../models/Question');
const AIQuestionCache = require('../models/AIQuestionCache');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper function to extract JSON safely from Gemini's response
const extractJSON = (text) => {
    if (!text) throw new Error('AI returned an empty response');
    
    try {
        // Strip markdown code blocks and handle potential text outside the JSON
        const cleanedText = text.replace(/```json\n?|```/g, '').trim();
        
        // Find the first '[' and last ']' to isolate the JSON array
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (innerError) {
                // Fallback to trying to parse the whole cleaned text
                return JSON.parse(cleanedText);
            }
        }
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("AI JSON Parsing Error:", e.message, "\nRaw AI Output:", text);
        throw new Error('The AI response was not in a valid format. Please try again.');
    }
};

// Helper function to call Groq API with Llama 3.3
const callGroq = async (prompt, isJson = false) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: isJson ? { type: "json_object" } : undefined,
        });
        
        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Groq returned an empty response');
        }

        return content;
    } catch (e) {
        console.error("Groq API Error:", e.message);
        throw e;
    }
};

// Generate questions from topic using Gemini
exports.generateQuestions = async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ success: false, message: 'AI Service is not configured (Missing Groq API Key)' });
        }

        const { topic, numberOfQuestions = 5, difficulty = 'medium', questionType = 'mcq' } = req.body;

        if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Topic is required' });
        }

        if (!Number.isInteger(numberOfQuestions) || numberOfQuestions <= 0) {
            return res.status(400).json({ success: false, message: 'numberOfQuestions must be a positive integer' });
        }

        const cacheKey = `${topic}_${difficulty}_${questionType}_${numberOfQuestions}`;
        const cacheEnabled = process.env.NODE_ENV !== 'test';
        let cached;

        if (cacheEnabled) {
            cached = await AIQuestionCache.findOne({ sourceText: cacheKey });
        }

        if (cached) {
            return res.json({
                success: true,
                message: 'Questions retrieved from cache',
                data: cached.generatedQuestions
            });
        }
        
        const prompt = `Generate ${numberOfQuestions} ${difficulty} difficulty ${questionType === 'mixed' ? 'MCQ and Theoretical' : questionType} questions about "${topic}".
        
        For each question, provide:
        1. The text of the question
        2. Options (ONLY for mcq type, otherwise an empty array [])
        3. The correct answer (for mcq: exactly as in options; for theoretical: a high-quality model answer)
        4. A detailed explanation of why the answer is correct
        5. The difficulty level
        6. The topic name
        7. Points (marks) based on complexity (MCQs: 1-4 marks, Theoretical: 5-15 marks)
        8. Type: exactly "mcq" or "theoretical"
        
        Return ONLY valid JSON array. No other text or markdown tags. Format:
        [
          {
            "text": "question text here",
            "options": ["option1", "option2", "option3", "option4"], 
            "correctAnswer": "option1",
            "explanation": "detailed explanation here",
            "difficulty": "${difficulty}",
            "topic": "${topic}",
            "points": 5,
            "type": "mcq"
          }
        ]`;
        
        const text = await callGroq(prompt, true);
        
        const generatedQuestions = extractJSON(text);

        if (!Array.isArray(generatedQuestions)) {
            throw new Error('AI did not return an array of questions');
        }
        
        const validatedQuestions = generatedQuestions.map(q => ({
            text: q.text || q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || 'No explanation provided',
            difficulty: q.difficulty || difficulty,
            topic: q.topic || topic,
            aiGenerated: true,
            points: q.points || (q.type === 'theoretical' ? 10 : 2),
            type: q.type || (questionType === 'mixed' ? 'mcq' : questionType)
        }));
        
        if (cacheEnabled) {
            const cache = new AIQuestionCache({
                sourceText: cacheKey,
                generatedQuestions: validatedQuestions
            });
            await cache.save();
        }
        
        res.json({
            success: true,
            message: `${validatedQuestions.length} questions generated successfully`,
            data: validatedQuestions,
            source: 'groq-llama-3.3'
        });
        
    } catch (error) {
        console.error('Groq AI Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate questions',
            error: error.message 
        });
    }
};

// Generate questions from text/content using Gemini
exports.generateQuestionsFromText = async (req, res) => {
    try {
        const { text, numberOfQuestions = 5, difficulty = 'medium' } = req.body;
        
        if (!text || text.length < 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide at least 50 characters of text' 
            });
        }
        
        const prompt = `Based on the following text, generate ${numberOfQuestions} ${difficulty} difficulty multiple choice questions.
        
        TEXT:
        ${text.substring(0, 4000)}
        
        Return ONLY valid JSON array. Format:
        [
          {
            "text": "...",
            "options": ["...", "...", "...", "..."],
            "correctAnswer": "...",
            "explanation": "...",
            "topic": "..."
          }
        ]`;
        
        const text_response = await callGroq(prompt, true);
        
        const generatedQuestions = extractJSON(text_response);
        
        const validatedQuestions = generatedQuestions.map(q => ({
            ...q,
            difficulty,
            aiGenerated: true
        }));
        
        res.json({
            success: true,
            message: `${validatedQuestions.length} questions generated from text`,
            data: validatedQuestions,
            source: 'groq-llama-3.3'
        });
        
    } catch (error) {
        console.error('Groq GenerateFromText Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Generate questions from URL
exports.generateQuestionsFromUrl = async (req, res) => {
    try {
        const { url, numberOfQuestions = 5, difficulty = 'medium' } = req.body;
        
        if (!url) {
            return res.status(400).json({ success: false, message: 'URL is required' });
        }
        
        const prompt = `Visit this URL and analyze the content: ${url}
        Generate ${numberOfQuestions} ${difficulty} difficulty multiple choice questions.
        Return ONLY a JSON array. Format: [{"text":"...","options":["...","...","...","..."],"correctAnswer":"...","explanation":"...","topic":"..."}]`;
        
        const text = await callGroq(prompt, true);
        
        const generatedQuestions = extractJSON(text);
        
        res.json({
            success: true,
            data: generatedQuestions,
            source: 'groq-llama-3.3'
        });
        
    } catch (error) {
        console.error('GenerateFromUrl Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process URL' });
    }
};

// Improve existing question
exports.improveQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { improvementType } = req.body;
        
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        
        let improvementPrompt = '';
        switch (improvementType) {
            case 'clarify':
                improvementPrompt = `Make this question clearer: "${question.text}"\nReturn ONLY the improved text.`;
                break;
            case 'expand':
                improvementPrompt = `Add more context: "${question.text}"\nReturn ONLY the expanded text.`;
                break;
            case 'simplify':
                improvementPrompt = `Simplify for beginners: "${question.text}"\nReturn ONLY the simplified text.`;
                break;
            default:
                improvementPrompt = `Improve this question: "${question.text}"\nReturn ONLY the improved text.`;
        }
        
        const improvedText = await callGroq(improvementPrompt);
        
        res.json({
            success: true,
            message: 'Question improved',
            data: {
                original: question.text,
                improved: improvedText.trim()
            }
        });
        
    } catch (error) {
        console.error('ImproveQuestion Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Explain answer
exports.explainAnswer = async (req, res) => {
    try {
        const { question, userAnswer, correctAnswer } = req.body;
        
        const prompt = `As a tutor, explain:
        Question: ${question}
        User's Answer: ${userAnswer}
        Correct Answer: ${correctAnswer}
        Provide: 1. Why correct is right. 2. Why user was wrong (if applicable). 3. A learning tip.`;
        
        const explanation = await callGroq(prompt);
        
        res.json({
            success: true,
            explanation: explanation
        });
        
    } catch (error) {
        console.error('ExplainAnswer Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Generate quiz summary
exports.generateQuizSummary = async (req, res) => {
    try {
        const { topic, performanceData } = req.body;
        
        const prompt = `Analyze this quiz data for topic "${topic}": ${JSON.stringify(performanceData)}
        Provide a feedback summary (max 100 words) with Strengths, Areas for Improvement, and Study Tips.`;
        
        const summary = await callGroq(prompt);
        
        res.json({
            success: true,
            summary: summary
        });
        
    } catch (error) {
        console.error('QuizSummary Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Generate flashcards
exports.generateFlashcards = async (req, res) => {
    try {
        const { topic, numberOfCards = 10 } = req.body;
        
        const prompt = `Create ${numberOfCards} flashcards for "${topic}". 
        Return as JSON array: [{"front": "Question/Term", "back": "Answer/Definition"}] 
        ONLY return valid JSON.`;
        
        const text = await callGroq(prompt, true);
        
        const flashcards = extractJSON(text);
        
        res.json({
            success: true,
            data: flashcards
        });
        
    } catch (error) {
        console.error('Flashcards Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};