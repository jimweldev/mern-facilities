import React from 'react'
import { Link } from 'react-router-dom'

const Facilities = () => {
  return (
    <>
      <h1 className="mb-3">Facilities</h1>

      <div className="row">
        <div className="col-md-6">
          <Link className="card" to="/facilities/offices">
            <div className="card-body">Offices</div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link className="card" to="/facilities/supplies">
            <div className="card-body">Supplies</div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Facilities
