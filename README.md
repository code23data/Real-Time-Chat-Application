# Real-Time Chat Application

A lightweight, web-based chat platform built with Node.js, Express, and Socket.io. This application allows users to join specific rooms, authenticate with a username, and exchange formatted messages in real-time.

## Features
* **Real-Time Messaging:** Instant message delivery using WebSockets.
* **Room Management:** Create/Join distinct rooms (General, Coding, etc.).
* **User Authentication:** Simple username-based entry system.
* **Rich Text Support:** Basic formatting for *bold*, _italics_, and clickable links.
* **Responsive UI:** Optimized for both desktop and mobile viewing.
* **Timestamps:** Every message is stamped with the local time of delivery.

Small chat demo built with Node.js, Express and Socket.IO. The frontend includes local `localStorage`-backed per-room message persistence and a UI for creating additional rooms.
- Real-time chat using Socket.IO, scoped by rooms.
- Per-room message persistence in the browser using `localStorage` (messages are stored locally and rendered on room switch).
- Simple message formatting: `*bold*`, `_italics_`, and automatic link detection.
- Highlighting for your own messages.
- Create new rooms from the sidebar; created rooms persist across page reloads.
- Stored messages are cleared on browser/tab close (current behavior). See Notes for customization.

## Quick start
1. Open a terminal and change into the project folder:
  ```bash
  cd Real-Time-Chat-Application-main
  ```
2. Install dependencies and start the server:
  ```bash
  npm install
  node server.js
  ```
3. Open the app in your browser:
  http://localhost:3000

## Usage
- Enter a username in the welcome overlay to join the chat.
- Click a room in the left sidebar to switch.
- Add a new room with the "New room name" field and `Add Room` button.
- Messages typed in the input are sent to the current room and saved in `localStorage` for that room.

## Notes
- Messages are sanitized/escaped before rendering to mitigate injection.
- The current implementation clears stored messages on `beforeunload`. To persist messages across browser restarts, remove the `beforeunload` cleanup in `public/script.js`.
- Rooms are stored in `localStorage` under the key `chat_rooms_v1`.
- Message history for rooms is stored under keys like `chat_messages_v1_{roomName}`.

## Project Structure

- `server.js` — Node/Express + Socket.IO server.
- `package.json` - A JSON file containing dependencies for Express and Socket.IO.
- `public/index.html` — Frontend markup.
- `public/style.css` — Frontend styling.
- `public/script.js` — Frontend logic (message storage, room creation, socket handlers).
