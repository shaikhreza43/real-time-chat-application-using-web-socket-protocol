const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const { joinUser, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

//Set the Static template folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//Run When a new user connects
io.on('connection', socket => {
    //console.log('New Web Socket Connected...');

    socket.on('joinRoom', ({ username, room }) => {

        const user = joinUser(socket.id, username, room);

        socket.join(user.room);

        //Welcome message for current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord App!!!'));

        //Broadcast when a user connected to chat
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has connected to Chat!`));

        //send users and room info
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });

    });



    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {

        //Get the current user based on socket id
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg));
    });

    //Runs when a user left the chat
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);
        if (user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat!`));
            io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });
        }
           
    });



})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`)
});