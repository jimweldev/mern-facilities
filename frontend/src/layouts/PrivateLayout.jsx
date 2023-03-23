import React, { useState, useEffect, Suspense } from 'react'

// libraries
import { Link, NavLink, Outlet } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

// redux
import { LOGOUT } from '../features/authUserSlice'

// components
import Loading from '../components/Loading'

// socket
import { socket } from '../services/socket'

import { SET_ONLINE_USERS } from '../features/onlineUsersSlice'

// icons
import {
  FiBell,
  FiMessageSquare,
  FiAlertCircle,
  FiSettings,
  FiUser,
  FiLogOut,
  FiPieChart,
  FiHome,
  FiCheckSquare,
  FiGrid,
} from 'react-icons/fi'

import { VscMegaphone } from 'react-icons/vsc'

// variables
import Avatar from '../assets/ayaka.jpg'

const PrivateLayout = () => {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser.value)

  // socket
  useEffect(() => {
    socket.emit('login', authUser.user._id)
  }, [])

  useEffect(() => {
    const onGetOnlineUsers = (onlineUsers) => {
      dispatch(SET_ONLINE_USERS(onlineUsers))
    }

    const onReceiveNotification = (notification) => {
      setNotifications((notifications) => [...notifications, notification])
    }

    const onReceiveAnnouncement = (announcement) => {
      setAnnouncements((announcements) => [...announcements, announcement])
    }

    socket.on('getOnlineUsers', onGetOnlineUsers)
    socket.on('receiveNotification', onReceiveNotification)
    socket.on('receiveAnnouncement', onReceiveAnnouncement)

    return () => {
      socket.off('getOnlineUsers', onGetOnlineUsers)
      socket.off('receiveNotification', onReceiveNotification)
      socket.off('receiveAnnouncement', onReceiveAnnouncement)
    }
  }, [socket])

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

  const [notifications, setNotifications] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="wrapper">
      <nav
        id="sidebar"
        className={`sidebar js-sidebar ${isSidebarCollapsed && 'collapsed'}`}
      >
        <div className="sidebar-content js-simplebar">
          <Link className="sidebar-brand" to="/">
            <span className="align-middle">MERN</span>
          </Link>

          <ul className="sidebar-nav">
            <li className="sidebar-header">Pages</li>

            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/">
                <FiHome className="feather align-middle" />
                <span className="align-middle">Home</span>
              </NavLink>
            </li>
            <li className="sidebar-item" hidden>
              <NavLink className="sidebar-link" to="/form-example">
                <FiCheckSquare className="feather align-middle" />
                <span className="align-middle">Form Example</span>
              </NavLink>
            </li>
            <li className="sidebar-item" hidden>
              <NavLink className="sidebar-link" to="/table-example">
                <FiGrid className="feather align-middle" />
                <span className="align-middle">Table Example</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink className="sidebar-link" to="/facilities">
                <FiGrid className="feather align-middle" />
                <span className="align-middle">Facilities</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <div className="main">
        <nav className="navbar navbar-expand navbar-light navbar-bg">
          <a
            className="sidebar-toggle js-sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <i className="hamburger align-self-center"></i>
          </a>

          <div className="navbar-collapse collapse">
            <ul className="navbar-nav navbar-align">
              <li className="nav-item dropdown">
                <a
                  className="nav-icon dropdown-toggle"
                  href="#"
                  id="alertsDropdown"
                  data-bs-toggle="dropdown"
                >
                  <div className="position-relative">
                    <FiBell className="feather align-middle" />
                    {notifications.length > 0 && (
                      <span className="indicator">{notifications.length}</span>
                    )}
                  </div>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0"
                  aria-labelledby="alertsDropdown"
                >
                  <div className="dropdown-menu-header">Notifications</div>

                  {/* has notifications */}
                  {notifications.map((notification) => {
                    return (
                      <div className="list-group" key={notification._id}>
                        <a href="#" className="list-group-item">
                          <div className="row align-items-center p-2">
                            <div className="col-2 p-0">
                              <div className="text-center">
                                <FiAlertCircle className="text-danger display-6 mb-0" />
                              </div>
                            </div>
                            <div className="col-10">
                              <div className="text-dark">
                                {notification.title}
                              </div>
                              <div className="text-muted small mt-1">
                                {notification.description}
                              </div>
                              <div className="text-muted small mt-1">
                                {notification.createdAt}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  })}

                  {/* no notifications */}
                  {notifications.length === 0 && (
                    <div className="list-group">
                      <div className="list-group-item text-center">
                        No notifications found.
                      </div>
                    </div>
                  )}

                  <div className="dropdown-menu-footer">
                    <a href="#" className="text-muted">
                      Show all notifications
                    </a>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-icon dropdown-toggle"
                  href="#"
                  id="messagesDropdown"
                  data-bs-toggle="dropdown"
                >
                  <div className="position-relative">
                    <VscMegaphone className="align-middle" />
                    {announcements.length > 0 && (
                      <span className="indicator">{announcements.length}</span>
                    )}
                  </div>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0"
                  aria-labelledby="messagesDropdown"
                >
                  <div className="dropdown-menu-header">
                    <div className="position-relative">Announcements</div>
                  </div>

                  {/* has announcements */}
                  {announcements.map((announcement) => {
                    return (
                      <div className="list-group" key={announcement._id}>
                        <a href="#" className="list-group-item">
                          <div className="row align-items-center p-2">
                            <div className="col-2 p-0">
                              <div className="text-center">
                                <FiAlertCircle className="text-danger display-6 mb-0" />
                              </div>
                            </div>
                            <div className="col-10">
                              <div className="text-dark">
                                {announcement.title}
                              </div>
                              <div className="text-muted small mt-1">
                                {announcement.description}
                              </div>
                              <div className="text-muted small mt-1">
                                {announcement.createdAt}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  })}

                  {/* no announcements */}
                  {announcements.length === 0 && (
                    <div className="list-group">
                      <div className="list-group-item text-center">
                        No announcements found.
                      </div>
                    </div>
                  )}
                  <div className="dropdown-menu-footer">
                    <a href="#" className="text-muted">
                      Show all announcements
                    </a>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-icon dropdown-toggle d-inline-block d-sm-none"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <FiSettings className="feather align-middle me-1" />
                </a>

                <a
                  className="nav-link dropdown-sm-toggle d-none d-sm-inline-block"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={Avatar}
                    className="avatar object-fit-cover rounded-circle border border-dark border-2 me-2"
                    alt="Charles Hall"
                  />
                </a>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                  <div className="p-3">
                    <img
                      src={Avatar}
                      className="avatar object-fit-cover rounded-circle border border-dark border-2 me-2"
                      alt={authUser.user.emailAddress}
                    />
                    <span className="text-dark me-2">
                      {authUser.user.emailAddress}
                    </span>
                  </div>
                  <hr className="m-2" />
                  <a className="dropdown-item" href="">
                    <FiUser className="feather align-middle me-2" />
                    Profile
                  </a>
                  <button
                    className="dropdown-item"
                    onClick={() => handleLogout()}
                    disabled={isLogoutLoading}
                  >
                    <FiLogOut className="feather align-middle me-2" />
                    Log out
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <main className="content">
          <div className="container-fluid p-0">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PrivateLayout
