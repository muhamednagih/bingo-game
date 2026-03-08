# Multiplayer Bingo Game

A complete, production-ready real-time multiplayer Bingo game for 4 players. Built with React, TailwindCSS, Node.js, Express, and Socket.io.

## Features
- 4-player real-time online multiplayer rooms via join codes.
- Authentic Bingo rules: 5x5 board, randomly generated numbers 1-25.
- Real-time turn-based action.
- Automatic line validation (horizontal and vertical). First to 5 lines wins!
- In-game chat room.
- Modern glowing UI with animations and sound effects.

## Folder Structure
- `/frontend` - Vite React App (UI, Game State, Socket Client)
- `/server` - Node.js Express Server (Socket.io Backend, Room Manager, Game Logic)

---

## How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Start the Backend Server
Open a terminal and navigate to the `server` directory:
```bash
cd bingo/server
npm install
npm start
```
The server will start running on `http://localhost:4000`.

### 2. Start the Frontend Application
Open a new terminal window and navigate to the `frontend` directory:
```bash
cd bingo/frontend
npm install
npm run dev
```
Open the provided local URL (e.g., `http://localhost:5173`) in your browser.
To play with yourself, open 4 separate private/incognito windows or tabs to join the same room!

---

## How to Deploy Online

To play with friends over the internet, you need to deploy both the frontend and the backend. 
A popular free and easy stack is **Vercel** (for frontend) and **Render** or **Railway** (for backend).

### Step 1: Deploy Backend (Render / Railway)
Since the backend uses Socket.io, it needs a stable environment that supports WebSockets.

**Using Render:**
1. Push your code to a GitHub repository.
2. Sign up at [Render.com](https://render.com).
3. Create a **New Web Service**.
4. Connect your GitHub repository.
5. Set the following:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Click Deploy. Once finished, copy the provided `onrender.com` URL (e.g., `https://bingo-server.onrender.com`).

### Step 2: Connect Frontend to the Deployed Backend
Before deploying the frontend, tell it to connect to your live backend.

1. Open `frontend/src/useGame.js`.
2. Find the Socket initialization line:
   ```javascript
   const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:4000' : '/');
   ```
3. Change `'/'` to your actual deployed backend URL:
   ```javascript
   const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://bingo-server.onrender.com');
   ```
4. Commit and push this change to GitHub.

### Step 3: Deploy Frontend (Vercel)
**Using Vercel:**
1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `frontend`.
6. Click **Deploy**.

Once finished, Vercel will give you a live URL. Share this link with 3 friends to start playing!
