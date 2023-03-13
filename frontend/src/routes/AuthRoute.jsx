import React from 'react'

// libraries
import { Navigate, Outlet } from 'react-router-dom'

const AuthRoute = ({ authUser }) => {
  if (!authUser) {
    return <Outlet />
  } else {
    return <Navigate to="/" replace={true} />
  }
}

export default AuthRoute
