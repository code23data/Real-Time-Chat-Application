const roomList = document.getElementById('room-list');
const newRoomInput = document.getElementById('new-room-input');
const addRoomBtn = document.getElementById('add-room-btn');
const messageDisplay = document.getElementById('message-display');
const roomTitle = document.getElementById('current-room-name');

let currentRoom = 'General'; // Default room
const socket = io(); // connect to server
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg-input');
const sendBtn = chatForm.querySelector('button[type="submit"]');

// Disable messaging UI until user joins with a username
if (msgInput) msgInput.disabled = true;
if (sendBtn) sendBtn.disabled = true;

// Handle room switching via event delegation on the `#room-list`
roomList.addEventListener('click', (e) => {
    const item = e.target.closest('.room-item');
    if (!item) return;
    if (!myUsername) {
        alert('Please enter a username and join the chat first.');
        return;
    }
    const newRoom = item.getAttribute('data-room');
    if (newRoom !== currentRoom) {
        const prev = document.querySelector('.room-item.active');
        if (prev) prev.classList.remove('active');
        item.classList.add('active');
        roomTitle.innerText = newRoom;
        messageDisplay.innerHTML = '';
        currentRoom = newRoom;
        socket.emit('join-room', { username: myUsername, room: currentRoom });
        renderMessagesForRoom(currentRoom);
    }
});

// Rooms persistence (keeps created rooms across reloads)
const ROOMS_KEY = 'chat_rooms_v1';
function loadRooms() {
    try {
        const raw = localStorage.getItem(ROOMS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function saveRooms(arr) {
    try { localStorage.setItem(ROOMS_KEY, JSON.stringify(arr)); } catch (e) {}
}

function addRoomToDOM(name) {
    const li = document.createElement('li');
    li.className = 'room-item';
    li.setAttribute('data-room', name);
    li.textContent = name;
    roomList.appendChild(li);
}

function addRoom(name) {
    const clean = ('' + name).trim();
    if (!clean) return false;
    // Prevent duplicates
    const existing = Array.from(roomList.querySelectorAll('.room-item')).some(r => r.getAttribute('data-room') === clean);
    if (existing) return false;
    addRoomToDOM(clean);
    // persist
    const rooms = loadRooms();
    rooms.push(clean);
    saveRooms(rooms);
    return true;
}

// Wire up add-room controls
if (addRoomBtn) {
    addRoomBtn.addEventListener('click', () => {
        const name = newRoomInput.value;
        if (addRoom(name)) {
            newRoomInput.value = '';
        } else {
            alert('Room name is required or already exists.');
        }
    });
    newRoomInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') addRoomBtn.click();
    });
}

// Load any persisted rooms (skip the default ones that are already in HTML)
document.addEventListener('DOMContentLoaded', () => {
    const persisted = loadRooms();
    persisted.forEach(r => {
        // Avoid adding duplicates
        const exists = Array.from(roomList.querySelectorAll('.room-item')).some(i => i.getAttribute('data-room') === r);
        if (!exists) addRoomToDOM(r);
    });
});

//--------------------------------------------------------------------------
function formatMessage(text) {
    return text
    .replace(/\*(.*?)\*/g, '<b>$1</b>')       // *bold*
    .replace(/_(.*?)_/g, '<i>$1</i>')         // _italics_
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>'); // links
}

// Usage when receiving a message:
// const formattedText = formatMessage(data.text);
// messageElement.innerHTML = formattedText;
//--------------------------------------------------------------------------

const loginOverlay = document.getElementById('login-overlay');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
let myUsername = "";

// Local storage prefix and helpers
const STORAGE_PREFIX = 'chat_messages_v1_';
const MAX_MESSAGES_PER_ROOM = 300;

function loadMessages(room) {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + room);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to load messages from storage', e);
        return [];
    }
}

function saveMessageToStorage(room, msgObj) {
    try {
        const key = STORAGE_PREFIX + room;
        const arr = loadMessages(room);
        arr.push(msgObj);
        if (arr.length > MAX_MESSAGES_PER_ROOM) arr.splice(0, arr.length - MAX_MESSAGES_PER_ROOM);
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
        console.error('Failed to save message to storage', e);
    }
}

function clearAllStoredMessages() {
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.indexOf(STORAGE_PREFIX) === 0) keysToRemove.push(k);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
        console.error('Failed to clear stored messages', e);
    }
}

function escapeHtml(unsafe) {
    return ('' + unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
}

function createMessageElement(data) {
    const el = document.createElement('div');
    el.className = 'message';
    if (myUsername && data.user === myUsername) el.classList.add('own');
    el.innerHTML = `\n        <div class="meta"><strong>${escapeHtml(data.user)}</strong> <span class="time">${escapeHtml(data.time)}</span></div>\n        <div class="text">${formatMessage(escapeHtml(data.text))}</div>\n    `;
    return el;
}

function renderMessagesForRoom(room) {
    messageDisplay.innerHTML = '';
    const msgs = loadMessages(room);
    msgs.forEach(m => {
        const el = createMessageElement(m);
        messageDisplay.appendChild(el);
    });
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
}

joinBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();

    if (name !== "") {
        myUsername = name;

        // Hide the login screen
        loginOverlay.classList.add('hidden');

        // Now connect/join the default room
        socket.emit('join-room', {
            username: myUsername,
            room: 'General'
        });

        // Render stored messages for the default room
        renderMessagesForRoom('General');

        // Enable messaging UI now that user is joined
        if (msgInput) msgInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        msgInput.focus();

        console.log("Logged in as:", myUsername);
    } else {
        alert("Please enter a valid username!");
    }
});

// Send message on form submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = msgInput.value.trim();
    if (!msg) return;

    socket.emit('new-message', {
        username: myUsername || 'Anonymous',
        room: currentRoom,
        message: msg
    });

    msgInput.value = '';
});

// Receive messages from server
socket.on('chat-message', (data) => {
    const msgObj = { user: data.user, text: data.text, time: data.time };
    // Store message scoped to the room the client believes it's in
    saveMessageToStorage(currentRoom, msgObj);
    const el = createMessageElement(msgObj);
    messageDisplay.appendChild(el);
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
});

// Clear stored messages when the browser/tab is being closed (application shutdown)
window.addEventListener('beforeunload', () => {
    clearAllStoredMessages();
});
