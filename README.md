# Real-Time Chat Application

A lightweight, web-based chat platform built with Node.js, Express, and Socket.io. This application allows users to join specific rooms, authenticate with a username, and exchange formatted messages in real-time.

## Features
* **Real-Time Messaging:** Instant message delivery using WebSockets.
* **Room Management:** Create/Join distinct rooms (General, Coding, etc.).
* **User Authentication:** Simple username-based entry system.
* **Rich Text Support:** Basic formatting for *bold*, _italics_, and clickable links.
* **Responsive UI:** Optimized for both desktop and mobile viewing.
* **Timestamps:** Every message is stamped with the local time of delivery.

## Prerequisites
Before running this application, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* npm (comes with Node.js)

## Installation & Setup
1. **Extract** the compressed folder.
2. **Open your terminal** or command prompt in the project directory.
3. **Install dependencies** by running:
   ```bash
   npm install

   ```

4. **Start the server** by running:
   ```bash
   node server.js

   ```


5. **Open your browser** and navigate to:
`http://localhost:3000`

## Project Structure

* `server.js`: The Node.js backend handling Socket.io connections and room logic.
* `public/`: Contains the frontend assets.
* `index.html`: The application structure and login overlay.
* `style.css`: Responsive Flexbox layout and styling.
* `script.js`: Client-side logic for DOM manipulation and socket events.
