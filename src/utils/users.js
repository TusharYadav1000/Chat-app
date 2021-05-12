const users = []

/* Adding the user */
const addUser = ({ id, username, room }) => {

    //Clear the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the user
    if (!username || !room) {
        return {
            error: 'Username  and room are  required'
        }
    }

    //Check for the existing username or room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'Username is in user'
        }
    }

    //Storing the user
    const user = { id, username, room }
    users.push(user)
    return { user }
}


/* Removing the user */
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}



/*Getting user by the id*/
const getUser = (id) => {
    const user = users.find((user) => user.id === id)
    return user
}


/*Get the users in a roomm */

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    const user = users.filter((user) => user.room === room)
    return user
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}