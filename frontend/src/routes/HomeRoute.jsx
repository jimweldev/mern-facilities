import React from 'react'

// libraries
import { Navigate, Outlet } from 'react-router-dom'

const HomeRoute = ({ authUser }) => {
  if (authUser) {
    return <Outlet />
  } else {
    return <Navigate to="/login" replace={true} />
  }
}

export default HomeRoute
