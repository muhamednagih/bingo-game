const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./roomManager');

const allowedOrigins = [
    'https://bingo-game-sandy.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

const app = express();
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const socketRooms = {};

app.get('/', (req, res) => {
    res.send('Multiplayer Bingo Server is running.');
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', ({ roomId, playerName, maxPlayers, boardSize, playerId }) => {
        const parsedMaxPlayers = maxPlayers ? parseInt(maxPlayers, 10) : 4;
        const parsedBoardSize = boardSize ? parseInt(boardSize, 10) : 5;

        const createRes = roomManager.createRoom(roomId, parsedMaxPlayers, parsedBoardSize, playerId);
        if (createRes.error) {
            socket.emit('error', createRes.error);
            return;
        }

        const joinRes = roomManager.joinRoom(roomId, { id: socket.id, name: playerName, playerId });
        if (joinRes.error) {
            socket.emit('error', joinRes.error);
            return;
        }

        socket.join(roomId);
        socketRooms[socket.id] = roomId;
        io.to(roomId).emit('roomState', joinRes.room);
    });

    socket.on('joinRoom', ({ roomId, playerName, playerId }) => {
        const res = roomManager.joinRoom(roomId, { id: socket.id, name: playerName, playerId });
        if (res.error) {
            socket.emit('error', res.error);
            return;
        }
        socket.join(roomId);
        socketRooms[socket.id] = roomId;
        io.to(roomId).emit('roomState', res.room);
    });

    socket.on('rejoinRoom', ({ roomId, playerId }) => {
        const result = roomManager.reconnectGame(roomId, socket.id, playerId);
        if (result) {
            socket.join(roomId);
            socketRooms[socket.id] = roomId;
            // Emit the specific rehydration state only to this user
            socket.emit('syncGameState', result);
            // Alert everyone else that the player is back
            io.to(roomId).emit('roomState', result.room);
        }
    });

    socket.on('toggleReady', (roomId) => {
        const room = roomManager.toggleReady(roomId, socket.id);
        if (room) {
            io.to(roomId).emit('roomState', room);
            if (room.status === 'playing') {
                io.to(roomId).emit('gameStarted');
            }
        }
    });

    socket.on('playTurn', ({ roomId, number }) => {
        const res = roomManager.playTurn(roomId, socket.id, number);
        if (res.error) {
            socket.emit('error', res.error);
            return;
        }

        io.to(roomId).emit('roomState', res.room);

        if (res.winners && res.winners.length > 0) {
            io.to(roomId).emit('gameOver', { winners: res.winners });
        }
    });

    socket.on('chatMessage', ({ roomId, message }) => {
        const room = roomManager.getRoom(roomId);
        if (!room) return;
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            io.to(roomId).emit('chatMessage', { sender: player.name, text: message });
        }
    });

    socket.on('restartGame', (roomId) => {
        const room = roomManager.resetRoom(roomId);
        if (room) {
            io.to(roomId).emit('roomState', room);
        }
    });

    socket.on('leaveRoom', (roomId) => {
        const roomOut = roomManager.leaveRoom(roomId, socket.id, true); // force remove
        if (roomOut && roomOut.destroyed) {
            io.to(roomId).emit('roomDestroyed');
            // Disconnect all sockets explicitly from that room
            io.socketsLeave(roomId);
        } else if (roomOut) {
            io.to(roomId).emit('roomState', roomOut);
        }
        socket.leave(roomId);
        delete socketRooms[socket.id];
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const roomId = socketRooms[socket.id];
        if (roomId) {
            // Check if backend logic handles the host dropping during wait VS play.
            // Usually we only auto-destroy if they explicitly click Back to Home, 
            // but for security we'll let roomManager decide if host disconnect implies destroy.
            // Based on roomManager, forceRemove = false so they are marked as isOffline,
            // preventing the room from being completely destroyed instantly if it's the host dropping by accident.
            // We only destroy instantly on explicitly leaving.
            const roomOut = roomManager.leaveRoom(roomId, socket.id, false);
            if (roomOut && roomOut.destroyed) {
                io.to(roomId).emit('roomDestroyed');
                io.socketsLeave(roomId);
            } else if (roomOut) {
                io.to(roomId).emit('roomState', roomOut);
            }
            delete socketRooms[socket.id];
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = server;
