const { model, fastModel } = require('../config/gemini');
const Question = require('../models/Question');
const AIQuestionCache = require('../models/AIQuestionCache');

// Helper function to extract JSON safely from Gemini's response
const extractJSON = (text) => {
    try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parsing Error. Raw Text:", text);
        throw new Error('Could not parse JSON response from AI');
    }
};

// Generate questions from topic using Gemini
exports.generateQuestions = async (req, res) => {
    try {
        const { topic, numberOfQuestions = 5, difficulty = 'medium', questionType = 'mcq' } = req.body;
        
        // 1. Check cache first to save API tokens
        const cacheKey = `${topic}_${difficulty}_${questionType}_${numberOfQuestions}`;
        const cached = await AIQuestionCache.findOne({ sourceText: cacheKey });
        
        if (cached) {
            return res.json({
                success: true,
                message: 'Questions retrieved from cache',
                data: cached.generatedQuestions
            });
        }
        
        // 2. Prepare Gemini Prompt
        const prompt = `Generate ${numberOfQuestions} ${difficulty} difficulty ${questionType} questions about "${topic}".
        
        For each question, provide:
        1. Question text
        2. 4 options (for mcq)
        3. The correct answer (exactly as written in options)
        4. A detailed explanation of why the answer is correct
        5. The difficulty level
        6. The topic name
        
        Return ONLY valid JSON array. No other text or markdown tags. Format:
        [
          {
            "question": "question text here",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": "option1",
            "explanation": "detailed explanation here",
            "difficulty": "${difficulty}",
            "topic": "${topic}"
          }
        ]`;
        
        // 3. Call Gemini API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // 4. Extract and Validate
        const generatedQuestions = extractJSON(text);
        
        const validatedQuestions = generatedQuestions.map(q => ({
            question: q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || 'No explanation provided',
            difficulty: q.difficulty || difficulty,
            topic: q.topic || topic,
            aiGenerated: true
        }));
        
        // 5. Cache the result for future use
        const cache = new AIQuestionCache({
            sourceText: cacheKey,
            generatedQuestions: validatedQuestions
        });
        await cache.save();
        
        res.json({
            success: true,
            message: `${validatedQuestions.length} questions generated successfully`,
            data: validatedQuestions,
            source: 'gemini-ai'
        });
        
    } catch (error) {
        console.error('Gemini AI Error:', error);
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
            "question": "...",
            "options": ["...", "...", "...", "..."],
            "correctAnswer": "...",
            "explanation": "...",
            "topic": "..."
          }
        ]`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text_response = response.text();
        
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
            source: 'gemini-ai'
        });
        
    } catch (error) {
        console.error('GenerateFromText Error:', error);
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
        Return ONLY a JSON array. Format: [{"question":"...","options":["...","...","...","..."],"correctAnswer":"...","explanation":"...","topic":"..."}]`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const generatedQuestions = extractJSON(text);
        
        res.json({
            success: true,
            data: generatedQuestions,
            source: 'gemini-ai'
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
        const { improvementType } = req.body; // 'clarify', 'expand', 'simplify'
        
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
        
        const result = await model.generateContent(improvementPrompt);
        const response = await result.response;
        const improvedText = response.text();
        
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
        
        const result = await fastModel.generateContent(prompt);
        const response = await result.response;
        
        res.json({
            success: true,
            explanation: response.text()
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
        
        const result = await fastModel.generateContent(prompt);
        const response = await result.response;
        
        res.json({
            success: true,
            summary: response.text()
        });
        
    } catch (error) {
        console.error('QuizSummary Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Generate flashcards (New feature)
exports.generateFlashcards = async (req, res) => {
    try {
        const { topic, numberOfCards = 10 } = req.body;
        
        const prompt = `Create ${numberOfCards} flashcards for "${topic}". 
        Return as JSON array: [{"front": "Question/Term", "back": "Answer/Definition"}] 
        ONLY return valid JSON.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        const flashcards = extractJSON(response.text());
        
        res.json({
            success: true,
            data: flashcards
        });
        
    } catch (error) {
        console.error('Flashcards Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};