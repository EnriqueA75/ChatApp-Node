const users = []

//addUser, removeUser, getUser, getUserInRoom

const addUser = ({id, username, room}) => {
    //Clear de data
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

    //validate data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing users 
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username 
    }) 

    //Validar username 
    if(existingUser){
        return {
            error: 'Username already exists'
        }
    }
    //store user 
    const user = {id, username, room}
    users.push(user)
    return { user }
}
const removeUser = ((id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
})
const getUser = ((id) => {
    return users.find((user) => user.id === id)
})

const getUserInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

addUser({
    id: 22,
    username: 'Andrw',
    room: 'south'
})
addUser({
    id: 12,
    username: 'Danield',
    room: 'south'
})
addUser({
    id: 33,
    username: 'Enri',
    room: 'north'
})

const userrom = getUserInRoom("south")
const userr = getUser(22)
const removedUser = removeUser(22)

// console.log(userr)
// console.log(userrom)
// console.log(removedUser)
// console.log(users)
module.exports = {addUser, removeUser, getUser, getUserInRoom}