const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get Room and Username from URI

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


const socket = io();

//Get Room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Join Room
socket.emit('joinRoom', { username, room });

//Getting Messages from Server
socket.on('message', message => {
    console.log(message);

    outputMsg(message);

    //Scroll to down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//output message to DOM
outputMsg = (msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
                        <p class="meta">${msg.username} <span>${msg.time}</span></p>
						<p class="text">
							${msg.text}
						</p>
    `

    document.querySelector('.chat-messages').appendChild(div);
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get the Message Text
    const message = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', message);

    //clear the input box after submit

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//Add Room Name to DOM
outputRoomName = (room) => {
    roomName.innerText = room;
}

outputUsers = (users) => {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}