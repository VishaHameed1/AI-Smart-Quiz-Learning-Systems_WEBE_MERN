import React, { createContext, useState, useContext, useReducer } from 'react';
import api from '../services/api';

const QuizContext = createContext();

const initialState = {
  currentQuiz: null,
  currentAttempt: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  loading: false,
  error: null,
  adaptiveMode: false,
  userSkillLevel: 1200,
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_QUIZ':
      return { ...state, currentQuiz: action.payload, loading: false };
    case 'SET_ATTEMPT':
      return { ...state, currentAttempt: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };
    case 'ADD_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.payload],
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case 'SET_ADAPTIVE_MODE':
      return { ...state, adaptiveMode: action.payload };
    case 'SET_USER_SKILL':
      return { ...state, userSkillLevel: action.payload };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = async (quizId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post(`/attempts/quiz/${quizId}/start`);
      dispatch({ type: 'SET_ATTEMPT', payload: response.data.data });
      
      // Fetch quiz questions
      const quizResponse = await api.get(`/quizzes/${quizId}`);
      dispatch({ type: 'SET_QUIZ', payload: quizResponse.data.data });
      dispatch({ type: 'SET_QUESTIONS', payload: quizResponse.data.data.questions });
      
      return response.data.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to start quiz' });
      throw error;
    }
  };

  const submitAnswer = async (attemptId, questionId, answer, timeTaken) => {
    try {
      const response = await api.post(`/attempts/${attemptId}/submit-answer`, {
        questionId,
        selectedAnswer: answer,
        timeTaken,
      });
      
      dispatch({ type: 'ADD_ANSWER', payload: { questionId, answer, ...response.data.data } });
      return response.data.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to submit answer' });
      throw error;
    }
  };

  const completeQuiz = async (attemptId) => {
    try {
      const response = await api.post(`/attempts/${attemptId}/complete`);
      return response.data.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to complete quiz' });
      throw error;
    }
  };

  const getNextAdaptiveQuestion = async (attemptId, lastQuestionId, wasCorrect, timeTaken) => {
    try {
      const response = await api.post(`/adaptive/attempt/${attemptId}/next`, {
        lastQuestionId,
        wasCorrect,
        timeTaken,
      });
      
      if (response.data.data) {
        dispatch({ type: 'SET_QUESTIONS', payload: [response.data.data] });
      }
      
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to get next question' });
      throw error;
    }
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  return (
    <QuizContext.Provider value={{
      ...state,
      startQuiz,
      submitAnswer,
      completeQuiz,
      getNextAdaptiveQuestion,
      resetQuiz,
      dispatch,
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};