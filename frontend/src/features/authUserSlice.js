import { createSlice } from '@reduxjs/toolkit'

export const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    value: null,
  },
  reducers: {
    LOGIN: (state, action) => {
      state.value = action.payload
    },
    LOGOUT: (state) => {
      state.value = null
    },
  },
})

export const { LOGIN, LOGOUT } = authUserSlice.actions
export default authUserSlice.reducer
