import React, { useState, useEffect, Suspense } from 'react'

import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import axios from 'axios'

// redux
import { LOGOUT } from '../features/authUserSlice'
import { SET_ONLINE_USERS } from '../features/onlineUsersSlice'

// scoket io
const socket = io(import.meta.env.VITE_API_ENDPOINT)

// components
import Loading from '../components/Loading'

const HomeLayout = () => {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser.value) || null
  const onlineUsers = useSelector((state) => state.onlineUsers.value) || null

  // logout states
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  const handleLogout = async () => {
    axios
      .get('api/auth/logout')
      .then(() => {
        dispatch(LOGOUT())
        socket.emit('logout')
      })
      .finally(() => {
        setIsLogoutLoading(false)
      })
  }

  useEffect(() => {
    socket.emit('login', authUser.user._id)
  }, [])

  useEffect(() => {
    const onGetOnlineUsers = (onlineUsers) => {
      dispatch(SET_ONLINE_USERS(onlineUsers))
    }

    socket.on('getOnlineUsers', onGetOnlineUsers)

    return () => {
      socket.off('getOnlineUsers', onGetOnlineUsers)
    }
  }, [socket])

  return (
    <>
      <h1>HomeLayout</h1>
      <button disabled={isLogoutLoading} onClick={() => handleLogout()}>
        Logout
      </button>

      {onlineUsers.map((onlineUser) => {
        return (
          <div key={onlineUser.socketId}>
            <h1>
              <span>{onlineUser.socketId}: </span> {onlineUser.userId}
            </h1>
          </div>
        )
      })}

      <Suspense fallback={<Loading />}>
        <Outlet socket={socket} />
      </Suspense>
    </>
  )
}

export default HomeLayout
