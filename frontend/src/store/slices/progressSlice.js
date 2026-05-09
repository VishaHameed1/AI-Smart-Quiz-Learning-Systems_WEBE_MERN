 import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  topics: [],
  currentTopic: null,
  masteryScores: {},
  loading: false,
  error: null
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload
    },
    setMasteryScore: (state, action) => {
      const { topic, score } = action.payload
      state.masteryScores[topic] = score
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setTopics, setMasteryScore, setLoading } = progressSlice.actions
export default progressSlice.reducer
