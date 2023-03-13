import { configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import authUserReducer from '../features/authUserSlice'
import onlineUsersReducer from '../features/onlineUsersSlice'

const rootPersistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  authUser: authUserReducer,
  onlineUsers: onlineUsersReducer,
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
