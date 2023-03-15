import React, { useState, useEffect } from 'react'

// libraries
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'

// components
import Table from '../../components/Table'
import TableField from '../../components/TableField'
import TableFallback from '../../components/TableFallback'

// hooks
import useDebounce from '../../hooks/useDebounce'

// socket
import { socket } from '../../services/socket'

const Home = () => {
  const onlineUsers = useSelector((state) => state.onlineUsers.value)

  const handleSendNotification = (userId, notification) => {
    socket.emit('sendNotification', userId, notification)
  }

  const handleSendAnnouncement = (announcement) => {
    socket.emit('sendAnnouncement', announcement)
  }

  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [sort, setSort] = useState('_id')
  const [page, setPage] = useState(1)

  const debouncedSearchTerm = useDebounce(search, 200)

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', { page, limit, sort, search: debouncedSearchTerm }],
    queryFn: () =>
      axios
        .get(
          `api/users?page=${page}&limit=${limit}&sort=${sort}&search=${debouncedSearchTerm}`
        )
        .then((res) => res.data),
    keepPreviousData: true,
    // refetchInterval: 1000,
  })

  const handleSearch = (search) => setSearch(search)
  const handleLimit = (limit) => setLimit(limit)
  const handleSort = (field) =>
    field === sort ? setSort(`-${field}`) : setSort(field)
  const handlePage = (page) => setPage(page)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Dashboard</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            handleSendAnnouncement('Announcement! Hello everyone!')
          }}
        >
          Announcement
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <Table
            handleSearch={handleSearch}
            handleLimit={handleLimit}
            handlePage={handlePage}
            limit={limit}
            page={page}
            data={users}
          >
            <thead>
              <tr>
                <th onClick={() => handleSort('_id')}>
                  <TableField column="ID" field="_id" sort={sort} />
                </th>
                <th>Status</th>
                <th onClick={() => handleSort('emailAddress')}>
                  <TableField
                    column="Email Address"
                    field="emailAddress"
                    sort={sort}
                  />
                </th>
                <th>Notify</th>
              </tr>
            </thead>
            <tbody>
              {/* has records */}
              {!isLoading &&
                !isError &&
                users.records.length !== 0 &&
                users.records.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>
                        {onlineUsers.some(
                          (onlineUser) => onlineUser.userId === user._id
                        ) ? (
                          <span className="badge rounded-pill bg-success">
                            Online
                          </span>
                        ) : (
                          <span className="badge rounded-pill bg-secondary">
                            Offline
                          </span>
                        )}
                      </td>
                      <td>{user.emailAddress}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            handleSendNotification(user._id, 'Notification')
                          }}
                        >
                          Notify
                        </button>
                      </td>
                    </tr>
                  )
                })}

              <TableFallback
                isLoading={isLoading}
                isError={isError}
                dataLength={users?.records.length}
              />
            </tbody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default Home
