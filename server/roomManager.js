const { generateBoard, checkLines } = require('./gameLogic');

const rooms = {};

// players inside a room: { id, name, board: [], lines: 0, ready: false }
// room status: 'waiting' | 'playing' | 'ended'
// turnIndex: points to current player in players array

function getRoom(roomId) {
    return rooms[roomId];
}

function createRoom(roomId, maxPlayers = 4, boardSize = 5, hostPlayerId = null) {
    if (rooms[roomId]) return { error: 'Room already exists.' };

    const pMaxPlayers = parseInt(maxPlayers) || 4;
    const pBoardSize = parseInt(boardSize) || 5;

    rooms[roomId] = {
        id: roomId,
        hostId: hostPlayerId, // Track the creator of the room
        players: [],
        status: 'waiting',
        turnIndex: 0,
        calledNumbers: [],
        maxPlayers: pMaxPlayers,
        boardSize: pBoardSize,
        requiredLines: Math.min(pBoardSize, 8)
    };

    return { room: rooms[roomId] };
}

function joinRoom(roomId, player) {
    const room = rooms[roomId];
    if (!room) return { error: 'Invalid Room Code.' };

    // Check if the player is already in the room (by playerId OR exact playerName)
    const existingPlayer = room.players.find(p => p.playerId === player.playerId || p.name === player.name);

    // If the game is not waiting, only allow returning players.
    if (!existingPlayer && room.status !== 'waiting') {
        return { error: 'Room is already in play.' };
    }

    if (!existingPlayer) {
        if (room.players.length >= room.maxPlayers) return { error: 'Room is full.' };
        room.players.push({
            id: player.id, // This is the socket ID
            playerId: player.playerId, // This is the persistent ID
            name: player.name,
            board: [],
            lines: 0,
            ready: false,
            isOffline: false
        });
    } else {
        // Player is returning (reconnecting). Update their socket id and connection status.
        // We DO NOT reset their board or lines.
        existingPlayer.id = player.id;
        // If they changed persistent ID but used the exact same name, sync the new ID
        existingPlayer.playerId = player.playerId;
        existingPlayer.isOffline = false;
    }

    return { room };
}

function reconnectGame(roomId, socketId, playerId) {
    const room = rooms[roomId];
    if (!room) return null;

    const existingPlayer = room.players.find(p => p.playerId === playerId);
    if (existingPlayer) {
        existingPlayer.id = socketId;
        existingPlayer.isOffline = false;
        return {
            room,
            playerState: {
                board: existingPlayer.board,
                calledNumbers: room.calledNumbers,
                lines: existingPlayer.lines,
                status: room.status,
                turnIndex: room.turnIndex,
                maxPlayers: room.maxPlayers,
                boardSize: room.boardSize
            }
        };
    }
    return null;
}

function leaveRoom(roomId, socketId, forceRemove = false) {
    const room = rooms[roomId];
    if (!room) return null;

    let playerObj = room.players.find(p => p.id === socketId);
    let isHost = playerObj && playerObj.playerId === room.hostId;

    if (isHost && forceRemove) {
        // Host has explicitly clicked 'Back to Home' or ended the game
        delete rooms[roomId];
        return { destroyed: true };
    }

    if (room.status === 'playing' && !forceRemove) {
        // Just mark as disconnected to allow reconnection
        if (playerObj) playerObj.isOffline = true;
    } else {
        // Actually remove them
        room.players = room.players.filter(p => p.id !== socketId);
    }

    if (room.players.length === 0 || room.players.every(p => p.isOffline)) {
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
    reconnectGame
};
