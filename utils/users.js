const users = [];

//Join User to chat
joinUser = (id, username, room) => {
    const user = { id, username, room }

    users.push(user);

    return user;
}

getCurrentUser = (id) => {
    return users.find((user) => user.id === id);
}

//User Leaves the chat
userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1)
        return users.splice(index, 1)[0];
}

//Get Room Users

getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}


module.exports = {
    joinUser,
    getCurrentUser,
    userLeave,
    getRoomUsers
}