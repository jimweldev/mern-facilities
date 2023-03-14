require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// require routes
const authRoutes = require('./routes/authRoute.js')
const userRoutes = require('./routes/userRoute.js')

// express app
const app = express()

// middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
)
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/auth/', authRoutes)
app.use('/api/users/', userRoutes)

// connect to db
const PORT = process.env.PORT || 4000

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`connecting to db & listening on port ${PORT}`)
    })

    const io = require('socket.io')(server, {
      pingTimeout: 60000, // turn off after 60 secs
      cors: {
        origin: process.env.CORS_ORIGIN,
      },
    })

    let onlineUsers = []

    io.on('connection', (socket) => {
      // backend
      // emit => send to frontend
      // on => receive from frontend

      // frontend
      // emit => send to backend
      // on => receive from backend

      // global functions
      const login = (userId) => {
        const isOnline = onlineUsers.some((onlineUser) => {
          return onlineUser.socketId === socket.id
        })

        if (!isOnline) {
          onlineUsers.push({ socketId: socket.id, userId })

          io.emit('getOnlineUsers', onlineUsers)
        }
      }

      const logout = () => {
        onlineUsers = onlineUsers.filter((onlineUser) => {
          return onlineUser.socketId !== socket.id
        })

        io.emit('getOnlineUsers', onlineUsers)
      }

      // socket functions
      socket.on('broadcastNotification', () => {
        socket.broadcast.emit('receiveBroadcastNotifications', 'notify')
      })

      socket.on('joinMyNotification', (userId) => {
        socket.join(userId)
      })

      socket.on('sendNotification', (userId) => {
        io.to(userId).emit('receiveMyNotifications', 'notify')
      })

      // auth functions
      socket.on('login', (userId) => {
        login(userId)
      })

      socket.on('logout', () => {
        logout()
      })

      socket.on('disconnect', () => {
        logout()
      })
    })
  })
  .catch((error) => {
    console.log(error)
  })
