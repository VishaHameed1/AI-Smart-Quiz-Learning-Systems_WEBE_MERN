import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'dark',
  loading: false
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state){ state.theme = state.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', state.theme); }
  }
});

export const { toggleTheme } = slice.actions;
export default slice.reducer;
