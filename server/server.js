const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./roomManager');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const socketRooms = {};

app.get('/', (req, res) => {
    res.send('Multiplayer Bingo Server is running.');
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // A player wants to join (or create) a room
    socket.on('joinRoom', ({ roomId, playerName, maxPlayers, boardSize }) => {
        // If maxPlayers/boardSize are provided, it implies they are trying to dictate room creation settings.
        const parsedMaxPlayers = maxPlayers ? parseInt(maxPlayers, 10) : 4;
        const parsedBoardSize = boardSize ? parseInt(boardSize, 10) : 5;
        const res = roomManager.joinRoom(roomId, { id: socket.id, name: playerName }, parsedMaxPlayers, parsedBoardSize);
        if (res.error) {
            socket.emit('error', res.error);
            return;
        }
        socket.join(roomId);
        socketRooms[socket.id] = roomId;
        io.to(roomId).emit('roomState', res.room);
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

        if (res.winner) {
            io.to(roomId).emit('gameOver', { winner: res.winner });
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

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const roomId = socketRooms[socket.id];
        if (roomId) {
            const room = roomManager.leaveRoom(roomId, socket.id);
            if (room) {
                io.to(roomId).emit('roomState', room);
            }
            delete socketRooms[socket.id];
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
