import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = { list: [], current: null, loading: false, error: null };

export const fetchQuizzes = createAsyncThunk('quiz/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/quizzes');
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const fetchQuizById = createAsyncThunk('quiz/fetchById', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/quizzes/${id}`);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: err.message });
  }
});

const slice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrent(state, action) { state.current = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (s)=>{s.loading=true;s.error=null})
      .addCase(fetchQuizzes.fulfilled, (s, a)=>{s.loading=false;s.list=a.payload})
      .addCase(fetchQuizzes.rejected, (s,a)=>{s.loading=false;s.error=a.payload||a.error})
      .addCase(fetchQuizById.pending, (s)=>{s.loading=true;s.error=null})
      .addCase(fetchQuizById.fulfilled, (s,a)=>{s.loading=false;s.current=a.payload})
      .addCase(fetchQuizById.rejected, (s,a)=>{s.loading=false;s.error=a.payload||a.error});
  }
});

export const { setCurrent } = slice.actions;
export default slice.reducer;
