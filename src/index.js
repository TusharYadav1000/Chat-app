const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('../src/utils/messages.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)



const port = process.env.PORT || 5000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

let count = 0;
io.on('connection', (socket) => {
    console.log('New WebSocket connection')




    /*Join*/
    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(` ${username} has joined`))
    })

    /* Sending the regular message */
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed")
        }
        io.to('pubg').emit('message', generateMessage(message))
        callback()
    })

    /* Sending the location */
    socket.on('sendLocation', (data, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${data.latitude},${data.longitude}`))
        callback()
    })

    /* When user Disconnect */
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left the chat'))
    })

})



server.listen(port, () => { console.log(`Server is running on ${port}`) })