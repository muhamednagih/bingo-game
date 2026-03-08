const io = require('socket.io-client');
const socket = io('http://localhost:4000');

socket.on('connect', () => {
    socket.emit('joinRoom', {
        roomId: 'DEBUG1',
        playerName: 'HostDebug',
        maxPlayers: 3,
        boardSize: 6
    });
});

socket.on('roomState', (state) => {
    console.log(JSON.stringify(state, null, 2));
    process.exit(0);
});

socket.on('error', (err) => {
    console.error(err);
    process.exit(1);
});
