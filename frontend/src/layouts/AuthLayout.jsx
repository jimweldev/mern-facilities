import React, { useEffect, Suspense } from 'react'

import { Link, NavLink, Outlet } from 'react-router-dom'

// components
import Loading from '../components/Loading'

const AuthLayout = () => {
  return (
    <div className="container px-3 py-5">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default AuthLayout
