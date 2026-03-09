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
    const room = createRoom(roomId, maxPlayers, boardSize);

    // Check if the player is already in the room (by sessionId OR exact playerName)
    const existingPlayer = room.players.find(p => p.sessionId === player.sessionId || p.name === player.name);

    // If the game is not waiting, only allow returning players.
    if (!existingPlayer && room.status !== 'waiting') {
        return { error: 'Room is already in play.' };
    }

    if (!existingPlayer) {
        if (room.players.length >= room.maxPlayers) return { error: 'Room is full.' };
        room.players.push({
            id: player.id,
            sessionId: player.sessionId,
            name: player.name,
            board: [],
            lines: 0,
            ready: false,
            connected: true
        });
    } else {
        // Player is returning (reconnecting). Update their socket id and connection status.
        // We DO NOT reset their board or lines.
        existingPlayer.id = player.id;
        // If they changed session ID but used the exact same name, sync the new session ID
        existingPlayer.sessionId = player.sessionId;
        existingPlayer.connected = true;
    }

    return { room };
}

function reconnectSession(roomId, playerId, sessionId) {
    const room = rooms[roomId];
    if (!room) return null;

    const existingPlayer = room.players.find(p => p.sessionId === sessionId);
    if (existingPlayer) {
        existingPlayer.id = playerId;
        existingPlayer.connected = true;
        return room;
    }
    return null;
}

function leaveRoom(roomId, playerId, forceRemove = false) {
    const room = rooms[roomId];
    if (!room) return null;

    if (room.status === 'playing' && !forceRemove) {
        // Just mark as disconnected to allow reconnection
        const player = room.players.find(p => p.id === playerId);
        if (player) player.connected = false;
    } else {
        // Actually remove them
        room.players = room.players.filter(p => p.id !== playerId);
    }

    if (room.players.length === 0 || room.players.every(p => !p.connected)) {
        delete rooms[roomId];
    } else if (room.status === 'playing' && forceRemove) {
        if (room.turnIndex >= room.players.length) {
            room.turnIndex = 0;
        }
    }
    return rooms[roomId] || null;
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

    let winners = [];

    // Update lines for all players
    room.players.forEach(p => {
        p.lines = checkLines(p.board, room.calledNumbers, room.boardSize);
        if (p.lines >= room.requiredLines) {
            winners.push(p);
        }
    });

    if (winners.length > 0) {
        room.status = 'ended';
    } else {
        room.turnIndex = (room.turnIndex + 1) % room.players.length;
    }

    // Always return an array (even if empty) to maintain consistency with frontend
    return { room, winners: winners.length > 0 ? winners : null };
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
    resetRoom,
    reconnectSession
};
