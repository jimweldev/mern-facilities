import { io } from 'socket.io-client'

// scoket io
export const socket = io(import.meta.env.VITE_API_ENDPOINT)
