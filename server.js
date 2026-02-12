const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage: Clear when server restarts
const chatHistory = {}; 

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (data) => {
        // Leave previous rooms
        Array.from(socket.rooms).forEach(room => {
            if (room !== socket.id) socket.leave(room);
        });

        socket.join(data.room);
        console.log(`${data.username} joined ${data.room}`);

        // SEND HISTORY: If room history exists, send it to the user who just joined
        if (chatHistory[data.room]) {
            socket.emit('load-history', chatHistory[data.room]);
        }
    });

    socket.on('new-message', (data) => {
        const messageData = {
            user: data.username,
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // SAVE TO MEMORY: Initialize array if room is new, then push message
        if (!chatHistory[data.room]) {
            chatHistory[data.room] = [];
        }
        chatHistory[data.room].push(messageData);

        // Limit history size (optional, e.g., last 100 messages) to prevent memory leaks
        if (chatHistory[data.room].length > 100) chatHistory[data.room].shift();

        io.to(data.room).emit('chat-message', messageData);
    });
});

http.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
