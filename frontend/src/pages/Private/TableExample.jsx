import React, { useState } from 'react'

// libraries
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// components
import Table from '../../components/Table'
import TableField from '../../components/TableField'
import TableFallback from '../../components/TableFallback'

// hooks
import useDebounce from '../../hooks/useDebounce'

const TableExample = () => {
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
      <h1 className="h3 mb-3">Table Example</h1>

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
                <th onClick={() => handleSort('emailAddress')}>
                  <TableField
                    column="Email Address"
                    field="emailAddress"
                    sort={sort}
                  />
                </th>
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
                      <td>{user.emailAddress}</td>
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

export default TableExample
