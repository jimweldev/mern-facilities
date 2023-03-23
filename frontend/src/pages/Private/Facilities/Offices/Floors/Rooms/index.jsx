import React, { useState, useEffect } from 'react'

// libraries
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import { Rnd } from 'react-rnd'

import { socket } from '../../../../../../services/socket'

const style = {
  border: 'solid 3px #ddd',
  background: '#f0f0f0',
}

const Rooms = () => {
  let { officeSlug, floorSlug } = useParams()

  // socket
  useEffect(() => {
    socket.emit('join', `${officeSlug}/${floorSlug}`)
  }, [])

  useEffect(() => {
    const onReceiveRooms = (rooms) => {
      setRooms(rooms)
    }

    socket.on('receiveRooms', onReceiveRooms)

    return () => {
      socket.off('receiveRooms', onReceiveRooms)
    }
  }, [socket])

  const handleSendRooms = (roomId, rooms) => {
    setRooms(rooms)
    socket.emit('sendRooms', roomId, rooms)
  }

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    axios
      .get(`api/rooms/office-slug/${officeSlug}/floor-slug/${floorSlug}`)
      .then((response) => {
        setRooms(response.data.rooms)
      })
      .catch((error) => {
        // setLoginError(error.response.data.error)
      })
      .finally(() => {
        // setIsLoginLoading(false)
      })
  }, [])

  const handleUpdateRoom = (roomId, updatedRoom) => {
    axios.patch(`api/rooms/${roomId}`, updatedRoom).then((res) => res.data)
  }

  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <>
      <h1 className="mb-1">Rooms</h1>

      <button
        className="btn btn-primary"
        onClick={() => setIsEditMode(!isEditMode)}
      >
        Editing Mode
      </button>
      <div
        className="parent"
        style={{
          height: '80vh',
          overflow: 'auto',
          position: 'relative',
          backgroundColor: '#fafafa',
          border: '1px solid black',
        }}
      >
        {rooms &&
          rooms.map((room) => {
            return (
              <Rnd
                key={room._id}
                style={style}
                size={{ width: room.width, height: room.height }}
                position={{ x: room.x, y: room.y }}
                onDragStop={(e, d) => {
                  const x = d.x > 0 ? d.x : 0
                  const y = d.y > 0 ? d.y : 0

                  const thisRooms = rooms.map((r) => {
                    if (r._id === room._id) {
                      r.x = x
                      r.y = y
                    }

                    return r
                  })

                  handleSendRooms(`${officeSlug}/${floorSlug}`, thisRooms)

                  const updatedRoom = {
                    x,
                    y,
                  }

                  handleUpdateRoom(room._id, updatedRoom)
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const width = ref.style.width
                  const height = ref.style.height

                  const thisRooms = rooms.map((r) => {
                    if (r._id === room._id) {
                      r.width = width
                      r.height = height
                    }

                    return r
                  })

                  handleSendRooms(`${officeSlug}/${floorSlug}`, thisRooms)

                  const updatedRoom = {
                    width,
                    height,
                  }

                  handleUpdateRoom(room._id, updatedRoom)
                }}
                // bounds={'parent'}
                minWidth={'100px'}
                minHeight={'100px'}
                resizeGrid={[10, 10]}
                dragGrid={[10, 10]}
                disableDragging={!isEditMode}
                enableResizing={isEditMode}
              >
                <Link
                  to={`/facilities/offices/${officeSlug}/${floorSlug}/${room.slug}`}
                >
                  Enter {room.label}
                </Link>
              </Rnd>
            )
          })}
      </div>
    </>
  )
}

export default Rooms
