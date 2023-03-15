import React from 'react'

// libraries
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = ({ authUser }) => {
  if (!authUser) {
    return <Outlet />
  } else {
    return <Navigate to="/" replace={true} />
  }
}

export default PublicRoute
