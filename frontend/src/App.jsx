import React, { useEffect, lazy } from 'react'

import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

// layouts
import AuthLayout from './layouts/AuthLayout'
import HomeLayout from './layouts/HomeLayout'

// routes
import AuthRoute from './routes/AuthRoute'
import HomeRoute from './routes/HomeRoute'

// auth pages
const Login = lazy(() => import('./pages/Auth/Login'))

// home pages
const Home = lazy(() => import('./pages/Home'))

// redux
import { LOGIN, LOGOUT } from './features/authUserSlice'

axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
axios.defaults.withCredentials = true

const App = () => {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser.value) || null

  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async function (error) {
      const originalRequest = error.config

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const response = await axios.get('api/auth/refresh', {
          withCredentials: true,
        })

        if (response.status === 200) {
          dispatch(LOGIN(response.data))
        }

        if (response.status === 204) {
          dispatch(LOGOUT())
        }

        return axiosApiInstance(originalRequest)
      }

      return Promise.reject(error)
    }
  )

  useEffect(() => {
    if (authUser) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${authUser.accessToken}`
    } else {
      axios.defaults.headers.common['Authorization'] = null
    }
  }, [authUser])

  return (
    <Routes>
      <Route element={<AuthRoute authUser={authUser} />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>

      <Route element={<HomeRoute authUser={authUser} />}>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
