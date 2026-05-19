import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = { currentAttempt: null, loading: false, error: null, results: null };

export const startAttempt = createAsyncThunk('attempt/start', async (quizId, thunkAPI) => {
  try {
    const res = await api.post(`/attempts/quiz/${quizId}/start`);
    return res.data.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data || { message: err.message }); }
});

export const submitAnswer = createAsyncThunk('attempt/submitAnswer', async ({ attemptId, payload }, thunkAPI) => {
  try {
    const res = await api.post(`/attempts/${attemptId}/submit-answer`, payload);
    return res.data.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data || { message: err.message }); }
});

export const completeAttempt = createAsyncThunk('attempt/complete', async (attemptId, thunkAPI) => {
  try {
    const res = await api.post(`/attempts/${attemptId}/complete`);
    return res.data.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data || { message: err.message }); }
});

export const fetchResults = createAsyncThunk('attempt/results', async (attemptId, thunkAPI) => {
  try {
    const res = await api.get(`/attempts/${attemptId}/results`);
    return res.data.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data || { message: err.message }); }
});

const slice = createSlice({
  name: 'attempt',
  initialState,
  reducers: {
    clearAttempt(state){ state.currentAttempt = null; state.results = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startAttempt.pending,(s)=>{s.loading=true;s.error=null})
      .addCase(startAttempt.fulfilled,(s,a)=>{s.loading=false;s.currentAttempt=a.payload})
      .addCase(startAttempt.rejected,(s,a)=>{s.loading=false;s.error=a.payload||a.error})
      .addCase(submitAnswer.pending,(s)=>{s.loading=true})
      .addCase(submitAnswer.fulfilled,(s,a)=>{s.loading=false})
      .addCase(submitAnswer.rejected,(s,a)=>{s.loading=false;s.error=a.payload||a.error})
      .addCase(completeAttempt.pending,(s)=>{s.loading=true})
      .addCase(completeAttempt.fulfilled,(s,a)=>{s.loading=false;s.results=a.payload})
      .addCase(completeAttempt.rejected,(s,a)=>{s.loading=false;s.error=a.payload||a.error})
      .addCase(fetchResults.pending,(s)=>{s.loading=true})
      .addCase(fetchResults.fulfilled,(s,a)=>{s.loading=false;s.results=a.payload})
      .addCase(fetchResults.rejected,(s,a)=>{s.loading=false;s.error=a.payload||a.error});
  }
});

export const { clearAttempt } = slice.actions;
export default slice.reducer;
