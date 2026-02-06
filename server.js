const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve your HTML/CSS files from a folder named 'public' (relative to this file)
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Logic for joining a specific room
    socket.on('join-room', (data) => {
        // Leave all previous rooms (except the private socket room)
        Array.from(socket.rooms).forEach(room => {
            if (room !== socket.id) socket.leave(room);
        });

        socket.join(data.room);
        console.log(`${data.username} joined ${data.room}`);
    });

    // Logic for receiving and sending messages
    socket.on('new-message', (data) => {
        // Broadcasts message only to people in that specific room
        io.to(data.room).emit('chat-message', {
            user: data.username,
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    });
});

http.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

