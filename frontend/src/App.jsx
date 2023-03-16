import React, { useEffect, lazy } from 'react'

import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

// layouts
import PublicLayout from './layouts/PublicLayout'
import PrivateLayout from './layouts/PrivateLayout'

// routes
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'

// publice pages
const Login = lazy(() => import('./pages/Auth/Login'))

// private pages
const Home = lazy(() => import('./pages/Home'))
const FormExample = lazy(() => import('./pages/Home/FormExample'))
const TableExample = lazy(() => import('./pages/Home/TableExample'))

// redux
import { LOGIN, LOGOUT } from './features/authUserSlice'

axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
axios.defaults.withCredentials = true

const App = () => {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser.value)

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
      <Route element={<PublicRoute authUser={authUser} />}>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute authUser={authUser} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form-example" element={<FormExample />} />
          <Route path="/table-example" element={<TableExample />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
