import React, { useEffect, Suspense } from 'react'

import { Link, NavLink, Outlet } from 'react-router-dom'

// components
import Loading from '../components/Loading'

const AuthLayout = () => {
  return (
    <>
      <h1>AuthLayout</h1>

      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default AuthLayout
