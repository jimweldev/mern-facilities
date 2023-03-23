import React, { useState, useEffect } from 'react'

// libraries
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useFormik } from 'formik'

import { Rnd } from 'react-rnd'

import { FiArrowLeft } from 'react-icons/fi'

import { socket } from '../../../../../../../services/socket'

const Spaces = () => {
  let { officeSlug, floorSlug, roomSlug } = useParams()

  // socket
  useEffect(() => {
    socket.emit('join', `${officeSlug}/${floorSlug}/${roomSlug}`)
  }, [])

  useEffect(() => {
    const onReceiveSpaces = (spaces) => {
      setSpaces(spaces)
    }

    socket.on('receiveSpaces', onReceiveSpaces)

    return () => {
      socket.off('receiveSpaces', onReceiveSpaces)
    }
  }, [socket])

  const handleSendSpaces = (spaceId, spaces) => {
    socket.emit('sendSpaces', spaceId, spaces)
  }

  const [office, setOffice] = useState(null)
  const [floor, setFloor] = useState(null)
  const [room, setRoom] = useState(null)
  const [spaceTypes, setSpaceTypes] = useState([])
  const [spaces, setSpaces] = useState([])

  const [selectedSpace, setSelectedSpace] = useState(null)

  useEffect(() => {
    fetchSpaceTypes()
    fetchSpaces()
  }, [])

  const fetchSpaces = () => {
    axios
      .get(
        `api/spaces/office-slug/${officeSlug}/floor-slug/${floorSlug}/room-slug/${roomSlug}`
      )
      .then((response) => {
        setOffice(response.data.office)
        setFloor(response.data.floor)
        setRoom(response.data.room)
        setSpaces(response.data.spaces)
      })
      .catch((error) => {
        // setLoginError(error.response.data.error)
      })
      .finally(() => {
        // setIsLoginLoading(false)
      })
  }

  const fetchSpaceTypes = () => {
    axios
      .get('api/space-types')
      .then((response) => {
        setSpaceTypes(response.data.spaceTypes)
      })
      .catch((error) => {
        // setLoginError(error.response.data.error)
      })
      .finally(() => {
        // setIsLoginLoading(false)
      })
  }

  const handleUpdateSpace = (roomId, updatedRoom) => {
    axios.patch(`api/spaces/${roomId}`, updatedRoom).then((res) => {
      let newSpaces = [...spaces]
      newSpaces = newSpaces.map((newSpace) => {
        if (newSpace._id === res.data._id) {
          newSpace = res.data
        }

        return newSpace
      })

      console.log(newSpaces)

      setSpaces(newSpaces)

      handleSendSpaces(`${officeSlug}/${floorSlug}/${roomSlug}`, newSpaces)
    })
  }

  const [isEditMode, setIsEditMode] = useState(false)

  const handleEditMode = () => setIsEditMode(!isEditMode)
  const handleSetSpaces = (spaces) => {
    setSpaces(spaces)
    handleSendSpaces(`${officeSlug}/${floorSlug}/${roomSlug}`, spaces)
  }

  // login function
  const handleCreateSpace = (values) => {
    values.roomId = room._id

    axios.post('api/spaces', values).then((response) => {
      let newSpaces = [...spaces]
      newSpaces.push(response.data)

      setSpaces(newSpaces)

      handleSendSpaces(`${officeSlug}/${floorSlug}/${roomSlug}`, newSpaces)
    })
  }

  // login form
  const formik = useFormik({
    initialValues: {
      roomId: '',
      spaceType: '',
      label: '',
      rowNumber: '',
      seatNumber: '',
    },
    validate: addSpaceValidate,
    onSubmit: handleCreateSpace,
  })

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Spaces</h1>
        <div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add Space
          </button>
          <button
            className="btn btn-primary d-inline-block d-xl-none ms-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <FiArrowLeft />
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-9">
          <div className="card">
            <div className="card-body">
              <div
                className={`parent border ${isEditMode && 'border-success'}`}
                style={{
                  height: '73vh',
                  overflow: 'auto',
                  position: 'relative',
                  backgroundColor: '#fafafa',
                  userSelect: 'none',
                }}
              >
                {spaces &&
                  spaces.map((space) => {
                    return (
                      <Rnd
                        onClick={() => setSelectedSpace(space)}
                        className="border bg-success p-1"
                        key={space._id}
                        size={{ width: space.width, height: space.height }}
                        position={{ x: space.x, y: space.y }}
                        onDragStop={(e, d) => {
                          const x = d.x > 0 ? d.x : 0
                          const y = d.y > 0 ? d.y : 0

                          const thisSpaces = spaces.map((s) => {
                            if (s._id === space._id) {
                              s.x = x
                              s.y = y
                            }

                            return s
                          })

                          setSpaces(thisSpaces)

                          const updatedSpace = {
                            x,
                            y,
                          }

                          handleUpdateSpace(space._id, updatedSpace)
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                          const width = ref.style.width
                          const height = ref.style.height

                          const thisSpaces = spaces.map((r) => {
                            if (r._id === space._id) {
                              r.width = width
                              r.height = height
                            }

                            return r
                          })

                          setSpaces(thisSpaces)

                          const updatedSpace = {
                            width,
                            height,
                          }

                          handleUpdateSpace(space._id, updatedSpace)
                        }}
                        minWidth={'100px'}
                        minHeight={'100px'}
                        resizeGrid={[10, 10]}
                        dragGrid={[10, 10]}
                        disableDragging={!isEditMode}
                        enableResizing={isEditMode}
                      >
                        <p>
                          {space.spaceType === 'Seat'
                            ? `${office?.code}${floor?.number}-R${space.rowNumber}-S${space.seatNumber}`
                            : space.label}
                        </p>
                      </Rnd>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 d-none d-xl-inline-block">
          <Settings
            isEditMode={isEditMode}
            handleEditMode={handleEditMode}
            handleSetSpaces={handleSetSpaces}
            selectedSpace={selectedSpace}
            office={office}
            floor={floor}
          />
        </div>
      </div>

      {/* MODALS */}
      {/* create space modal */}
      <form
        className="modal fade"
        id="exampleModal"
        onSubmit={formik.handleSubmit}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Space</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="spaceType">Space Type</label>
                <select
                  className={`form-control form-control-lg ${
                    formik.errors.spaceType &&
                    formik.touched.spaceType &&
                    'invalid'
                  }`}
                  id="spaceType"
                  type="text"
                  {...formik.getFieldProps('spaceType')}
                >
                  <option value="">-- Select --</option>
                  {spaceTypes &&
                    spaceTypes.map((spaceType) => {
                      return (
                        <option key={spaceType._id} value={spaceType.label}>
                          {spaceType.label}
                        </option>
                      )
                    })}
                </select>
                {formik.errors.spaceType && formik.touched.spaceType && (
                  <div className="form-text text-danger">
                    {formik.errors.spaceType}
                  </div>
                )}
              </div>

              <div className="mb-3" hidden={formik.values.spaceType === 'Seat'}>
                <label htmlFor="label">Label</label>
                <input
                  className={`form-control form-control-lg ${
                    formik.errors.label && formik.touched.label && 'invalid'
                  }`}
                  id="label"
                  type="text"
                  {...formik.getFieldProps('label')}
                />
                {formik.errors.label && formik.touched.label && (
                  <div className="form-text text-danger">
                    {formik.errors.label}
                  </div>
                )}
              </div>

              <div className="mb-3" hidden={formik.values.spaceType !== 'Seat'}>
                <label className="form-label">Label</label>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={office?.code + String(floor?.number)}
                      readOnly
                    />
                  </div>

                  <div className="col">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">R</span>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.errors.rowNumber &&
                          formik.touched.rowNumber &&
                          'invalid'
                        }`}
                        {...formik.getFieldProps('rowNumber')}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">S</span>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.errors.seatNumber &&
                          formik.touched.seatNumber &&
                          'invalid'
                        }`}
                        {...formik.getFieldProps('seatNumber')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* OFFCANVAS */}
      {/* settings */}
      <div
        className="offcanvas offcanvas-end bg-light"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">Settings</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <Settings
            isEditMode={isEditMode}
            handleEditMode={handleEditMode}
            handleSetSpaces={handleSetSpaces}
            selectedSpace={selectedSpace}
            office={office}
            floor={floor}
          />
        </div>
      </div>
    </>
  )
}

export default Spaces

const Settings = ({
  isEditMode,
  handleEditMode,
  handleSetSpaces,
  selectedSpace,
  office,
  floor,
}) => {
  const handleEditClick = () => {
    handleEditMode()
  }

  const handleSetSpacesClick = (spaces) => {
    handleSetSpaces(spaces)
  }

  // login function
  const handleFillSpaceRow = (values) => {
    values.spaceId = selectedSpace._id
    console.log(values)
    axios.post('api/spaces/fill-space-row', values).then((response) => {
      handleSetSpacesClick(response.data)
    })
  }

  // login form
  const formik = useFormik({
    initialValues: {
      spaceId: '',
      lastSeatNumber: '',
    },
    validate: fillSpaceRowValidate,
    onSubmit: handleFillSpaceRow,
  })

  return (
    <>
      <div className="card">
        <div className="card-body">
          <button
            className={`btn ${isEditMode ? 'btn-success' : 'btn-primary'}`}
            onClick={() => handleEditClick()}
          >
            Editing Mode
          </button>
        </div>
      </div>

      {selectedSpace && selectedSpace.spaceType !== 'Seat' && (
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="label">Label</label>
              <input
                className="form-control form-control-lg"
                id="label"
                type="text"
                value={selectedSpace.spaceType}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {selectedSpace && selectedSpace.spaceType === 'Seat' && (
        <form className="card" onSubmit={formik.handleSubmit}>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="label">Label</label>
              <input
                className="form-control form-control-lg"
                id="label"
                type="text"
                value={`${office?.code}${String(floor?.number)}-R${String(
                  selectedSpace.rowNumber
                )}-S${String(selectedSpace.seatNumber)}`}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="label">Fill Row</label>
              <div className="row">
                <div className="col-5">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">S</span>
                    <input
                      type="text"
                      className={`form-control`}
                      value={selectedSpace.seatNumber}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-2">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">-</span>
                  </div>
                </div>

                <div className="col-5">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">S</span>
                    <input
                      type="text"
                      className={`form-control ${
                        formik.errors.lastSeatNumber &&
                        formik.touched.lastSeatNumber &&
                        'invalid'
                      }`}
                      {...formik.getFieldProps('lastSeatNumber')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export { Settings }

// login validation
const addSpaceValidate = (values) => {
  const errors = {}

  // check if username is not empty
  if (!values.spaceType) {
    errors.spaceType = 'Required'
  }

  if (values.spaceType !== 'Seat') {
    // check if username is not empty
    if (!values.label) {
      errors.label = 'Required'
    }
  }

  if (values.spaceType === 'Seat') {
    // check if username is not empty
    if (!values.rowNumber || !values.seatNumber) {
      errors.rowNumber = 'Required'
      errors.seatNumber = 'Required'
      errors.label = 'Required'
    }
  }

  return errors
}

const fillSpaceRowValidate = (values) => {
  const errors = {}

  // check if username is not empty
  if (!values.lastSeatNumber) {
    errors.spaceType = 'Required'
  }

  return errors
}
