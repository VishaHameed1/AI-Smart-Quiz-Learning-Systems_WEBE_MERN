import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = { overview: null, heatmap: null, history: [], topic: {}, loading: false, error: null };

export const fetchOverview = createAsyncThunk('progress/overview', async (_, thunkAPI) => {
  try { const res = await api.get('/progress/overview'); return res.data.data; }
  catch(err){ return thunkAPI.rejectWithValue(err.response?.data||{message:err.message}); }
});

export const fetchHeatmap = createAsyncThunk('progress/heatmap', async (_, thunkAPI) => {
  try { const res = await api.get('/progress/heatmap'); return res.data.data; }
  catch(err){ return thunkAPI.rejectWithValue(err.response?.data||{message:err.message}); }
});

const slice = createSlice({ name: 'progress', initialState, reducers: {}, extraReducers: (b)=>{
  b.addCase(fetchOverview.pending,(s)=>{s.loading=true})
   .addCase(fetchOverview.fulfilled,(s,a)=>{s.loading=false;s.overview=a.payload})
   .addCase(fetchOverview.rejected,(s,a)=>{s.loading=false;s.error=a.payload||a.error})
   .addCase(fetchHeatmap.pending,(s)=>{s.loading=true})
   .addCase(fetchHeatmap.fulfilled,(s,a)=>{s.loading=false;s.heatmap=a.payload})
   .addCase(fetchHeatmap.rejected,(s,a)=>{s.loading=false;s.error=a.payload||a.error});
}});

export default slice.reducer;
