import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setProgress } = progressSlice.actions;
export default progressSlice.reducer;
