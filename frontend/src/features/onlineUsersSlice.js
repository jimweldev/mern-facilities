import { createSlice } from '@reduxjs/toolkit'

export const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState: {
    value: null,
  },
  reducers: {
    SET_ONLINE_USERS: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { SET_ONLINE_USERS } = onlineUsersSlice.actions
export default onlineUsersSlice.reducer
