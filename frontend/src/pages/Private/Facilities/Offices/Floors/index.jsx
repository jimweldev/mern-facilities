import React from 'react'

// libraries
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Floors = () => {
  let { officeSlug } = useParams()

  const { data: office } = useQuery({
    queryKey: ['offices', 'office-slug', officeSlug],
    queryFn: () =>
      axios
        .get(`api/offices/office-slug/${officeSlug}`)
        .then((res) => res.data),
  })

  const { data: floors } = useQuery({
    queryKey: ['floors', { officeId: office?._id }],
    queryFn: () =>
      axios.get(`api/floors?officeId=${office?._id}`).then((res) => res.data),
    enabled: office != null,
  })

  return (
    <>
      <h1 className="mb-3">{office && `${office.label} - Floors`}</h1>

      <div className="row">
        {floors &&
          floors.records.map((floor) => {
            return (
              <div className="col-md-6" key={floor._id}>
                <Link
                  className="card"
                  to={`/facilities/offices/${officeSlug}/${floor.slug}`}
                >
                  <div className="card-body">{floor.label}</div>
                </Link>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default Floors
