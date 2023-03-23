import React from 'react'

// libraries
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Offices = () => {
  const {
    data: offices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['offices'],
    queryFn: () => axios.get('api/offices').then((res) => res.data),
  })

  return (
    <>
      <h1 className="mb-3">Offices</h1>

      <div className="row">
        {offices &&
          offices.records.map((office) => {
            return (
              <div className="col-md-3" key={office._id}>
                <Link
                  className="card"
                  to={`/facilities/offices/${office.slug}`}
                >
                  <div className="card-body">{office.label}</div>
                </Link>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default Offices
