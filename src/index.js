const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('../src/utils/messages.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)



const port = process.env.PORT || 5000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')




    /*Join*/
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        console.error(error)
        if (error) {
            console.log(error)
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', ` ${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    /* Sending the regular message */
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        console.log(message)
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed")
        }
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    /* Sending the location */
    socket.on('sendLocation', (data, callback) => {
        const user = getUser(socket.id);
        console.log(user)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${data.latitude},${data.longitude}`))
        callback()
    })

    /* When user Disconnect */
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `A ${user.username} has left the chat!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})



server.listen(port, () => { console.log(`Server is running on ${port}`) })