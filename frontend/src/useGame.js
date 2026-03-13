import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { playWin } from './utils/sounds';

const getPlayerId = () => {
    let pid = localStorage.getItem('bingoPlayerId');
    if (!pid) {
        pid = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('bingoPlayerId', pid);
    }
    return pid;
};

const socket = io('https://unmoderated-felecia-unadjunctively.ngrok-free.dev', {
    withCredentials: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
    }
});

export function useGame() {
    const [roomId, setRoomId] = useState(null);
    const [roomState, setRoomState] = useState(null);
    const [error, setError] = useState(null);
    const [socketId, setSocketId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [winners, setWinners] = useState(null);

    const handleRejoin = useCallback(() => {
        const savedRoomId = sessionStorage.getItem('bingoRoomId');
        if (savedRoomId && socket.disconnected) {
            socket.connect();
        } else if (savedRoomId && socket.connected) {
            socket.emit('rejoinRoom', { roomId: savedRoomId, playerId: getPlayerId() });
        }
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            setSocketId(socket.id);
            const savedRoomId = sessionStorage.getItem('bingoRoomId');
            if (savedRoomId) {
                // Auto-reconnect if we have a saved room ID
                socket.emit('rejoinRoom', { roomId: savedRoomId, playerId: getPlayerId() });
            }
        });

        socket.on('syncGameState', (playerState) => {
            if (playerState && playerState.room) {
                setRoomId(playerState.room.id);
                setRoomState(playerState.room);
                setError(null);
            }
        });

        socket.on('rehydrateState', (playerState) => {
            if (playerState && playerState.room) {
                // The backend now sends { room, playerState: { ... } }
                // We map this directly to roomState to instantly bypass Lobby
                setRoomId(playerState.room.id);
                setRoomState(playerState.room);
                setError(null);
            }
        });

        socket.on('roomState', (state) => {
            if (state && state.id) {
                setRoomId(state.id);
            }
            setRoomState(state);
            setError(null);
        });

        socket.on('roomCreated', (id) => {
            setRoomId(id);
            sessionStorage.setItem('bingoRoomId', id);
        });

        socket.on('error', (msg) => {
            setError(msg);
        });

        socket.on('gameOver', ({ winners }) => {
            setWinners(winners);
            playWin();
        });

        socket.on('chatMessage', (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        socket.on('roomDestroyed', () => {
            setRoomId(null);
            sessionStorage.removeItem('bingoRoomId');
            setRoomState(null);
            setWinners(null);
            setChatMessages([]);
            setError("The Host has ended the game/disconnected. Room Destroyed.");
        });

        return () => {
            socket.off('connect');
            socket.off('roomState');
            socket.off('roomCreated');
            socket.off('error');
            socket.off('gameOver');
            socket.off('chatMessage');
            socket.off('syncGameState');
            socket.off('roomDestroyed');
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleRejoin();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [handleRejoin]);

    const createRoom = useCallback((id, name, maxPlayers, boardSize) => {
        socket.emit('createRoom', { roomId: id, playerName: name, maxPlayers, boardSize, playerId: getPlayerId() });
        setRoomId(id);
        sessionStorage.setItem('bingoRoomId', id);
    }, []);

    const joinRoom = useCallback((id, name) => {
        socket.emit('joinRoom', { roomId: id, playerName: name, playerId: getPlayerId() });
        setRoomId(id);
        sessionStorage.setItem('bingoRoomId', id);
    }, []);

    const toggleReady = useCallback(() => {
        if (roomId) socket.emit('toggleReady', roomId);
    }, [roomId]);

    const playTurn = useCallback((number) => {
        if (roomId) socket.emit('playTurn', { roomId, number });
    }, [roomId]);

    const sendMessage = useCallback((message) => {
        if (roomId) socket.emit('chatMessage', { roomId, message });
    }, [roomId]);

    const restartGame = useCallback(() => {
        if (roomId) {
            socket.emit('restartGame', roomId);
            setWinners(null);
        }
    }, [roomId]);

    const leaveRoom = useCallback(() => {
        if (roomId) {
            socket.emit('leaveRoom', roomId);
            setRoomId(null);
            sessionStorage.removeItem('bingoRoomId');
            setRoomState(null);
            setWinners(null);
            setChatMessages([]);
            setError(null);
        }
    }, [roomId]);

    return {
        socket,
        roomId,
        roomState,
        playerId: socketId,
        error,
        winners,
        chatMessages,
        createRoom,
        joinRoom,
        toggleReady,
        playTurn,
        sendMessage,
        restartGame,
        leaveRoom
    };
}
