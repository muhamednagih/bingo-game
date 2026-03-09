const { generateBoard, checkLines } = require('./gameLogic');

const rooms = {};

// players inside a room: { id, name, board: [], lines: 0, ready: false }
// room status: 'waiting' | 'playing' | 'ended'
// turnIndex: points to current player in players array

function getRoom(roomId) {
    return rooms[roomId];
}

function createRoom(roomId, maxPlayers = 4, boardSize = 5) {
    if (!rooms[roomId]) {
        const pMaxPlayers = parseInt(maxPlayers) || 4;
        const pBoardSize = parseInt(boardSize) || 5;
        rooms[roomId] = {
            players: [],
            status: 'waiting',
            turnIndex: 0,
            calledNumbers: [],
            maxPlayers: pMaxPlayers,
            boardSize: pBoardSize,
            requiredLines: Math.min(pBoardSize, 8)
        };
    }
    return rooms[roomId];
}

function joinRoom(roomId, player, maxPlayers = 4, boardSize = 5) {
    // createRoom only initializes the room if it doesn't already exist.
    const room = createRoom(roomId, maxPlayers, boardSize);

    if (room.status !== 'waiting') return { error: 'Room is already in play.' };
    if (room.players.length >= room.maxPlayers) return { error: 'Room is full.' };

    const existingPlayer = room.players.find(p => p.id === player.id);
    if (!existingPlayer) {
        room.players.push({
            id: player.id,
            name: player.name,
            board: [],
            lines: 0,
            ready: false
        });
    }

    return { room };
}

function leaveRoom(roomId, playerId) {
    const room = rooms[roomId];
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);
    if (room.players.length === 0) {
        delete rooms[roomId];
    } else if (room.status === 'playing') {
        // If a player leaves during game, we might end it or skip their turn.
        // For simplicity, we keep the game going but skip them.
        if (room.turnIndex >= room.players.length) {
            room.turnIndex = 0;
        }
    }
    return room;
}

function toggleReady(roomId, playerId) {
    const room = rooms[roomId];
    if (!room) return null;
    const player = room.players.find(p => p.id === playerId);
    if (player) {
        player.ready = !player.ready;
    }

    // Check if all players are ready and there are exactly maxPlayers
    if (room.players.length === room.maxPlayers && room.players.every(p => p.ready)) {
        startGame(roomId);
    }
    return room;
}

function startGame(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    room.status = 'playing';
    room.turnIndex = 0;
    room.calledNumbers = [];

    room.players.forEach(p => {
        p.board = generateBoard(room.boardSize);
        p.lines = 0;
    });
}

function playTurn(roomId, playerId, number) {
    const room = rooms[roomId];
    if (!room || room.status !== 'playing') return { error: 'Invalid room state.' };

    const currentPlayer = room.players[room.turnIndex];
    if (currentPlayer.id !== playerId) return { error: 'Not your turn.' };

    if (room.calledNumbers.includes(number)) return { error: 'Number already called.' };

    const maxNumber = room.boardSize * room.boardSize;
    if (number < 1 || number > maxNumber) return { error: `Invalid number. Must be between 1 and ${maxNumber}.` };

    room.calledNumbers.push(number);

    let winner = null;

    // Update lines for all players
    room.players.forEach(p => {
        p.lines = checkLines(p.board, room.calledNumbers, room.boardSize);
        if (p.lines >= room.requiredLines) {
            winner = p;
        }
    });

    if (winner) {
        room.status = 'ended';
    } else {
        room.turnIndex = (room.turnIndex + 1) % room.players.length;
    }

    return { room, winner };
}

function resetRoom(roomId) {
    const room = rooms[roomId];
    if (!room) return null;

    room.status = 'waiting';
    room.turnIndex = 0;
    room.calledNumbers = [];
    room.players.forEach(p => {
        p.ready = false;
        p.board = [];
        p.lines = 0;
    });

    return room;
}

module.exports = {
    getRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    playTurn,
    resetRoom
};
