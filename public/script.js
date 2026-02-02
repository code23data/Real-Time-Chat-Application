const roomItems = document.querySelectorAll('.room-item');
const messageDisplay = document.getElementById('message-display');
const roomTitle = document.getElementById('current-room-name');

let currentRoom = 'General'; // Default room

roomItems.forEach(item => {
    item.addEventListener('click', () => {
        const newRoom = item.getAttribute('data-room');

        if (newRoom !== currentRoom) {
            // 1. Update UI state
            document.querySelector('.room-item.active').classList.remove('active');
            item.classList.add('active');
            roomTitle.innerText = newRoom;

            // 2. Clear the message area for the new room
            messageDisplay.innerHTML = '';

            // 3. Notify the server to switch rooms
            currentRoom = newRoom;
            socket.emit('join-room', {
                username: myUsername,
                room: currentRoom
            });
        }
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

        console.log("Logged in as:", myUsername);
    } else {
        alert("Please enter a valid username!");
    }
});
