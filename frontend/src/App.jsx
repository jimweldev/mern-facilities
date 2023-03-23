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
const Login = lazy(() => import('./pages/Public/Login'))

// private pages
const Home = lazy(() => import('./pages/Private'))
const Facilities = lazy(() => import('./pages/Private/Facilities'))
const Offices = lazy(() => import('./pages/Private/Facilities/Offices'))
const Floors = lazy(() => import('./pages/Private/Facilities/Offices/Floors'))
const Rooms = lazy(() => import('./pages/Private/Facilities/Offices/Floors/Rooms'))
const Spaces = lazy(() =>
  import('./pages/Private/Facilities/Offices/Floors/Rooms/Spaces')
)
const FormExample = lazy(() => import('./pages/Private/FormExample'))
const TableExample = lazy(() => import('./pages/Private/TableExample'))

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

      {/* prettier-ignore */}
      <Route element={<PrivateRoute authUser={authUser} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/offices" element={<Offices />} />
          <Route path="/facilities/offices/:officeSlug" element={<Floors />} />
          <Route path="/facilities/offices/:officeSlug/:floorSlug" element={<Rooms />} />
          <Route path="/facilities/offices/:officeSlug/:floorSlug/:roomSlug" element={<Spaces />} />
          <Route path="/form-example" element={<FormExample />} />
          <Route path="/table-example" element={<TableExample />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
