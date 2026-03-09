import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { playWin } from './utils/sounds';

const socket = io('https://unmoderated-felecia-unadjunctively.ngrok-free.dev', {
    withCredentials: true
});

export function useGame() {
    const [roomId, setRoomId] = useState(null);
    const [roomState, setRoomState] = useState(null);
    const [error, setError] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.on('connect', () => {
            setPlayerId(socket.id);
        });

        socket.on('roomState', (state) => {
            setRoomState(state);
            setError(null);
        });

        socket.on('roomCreated', (id) => {
            setRoomId(id);
        });

        socket.on('error', (msg) => {
            setError(msg);
        });

        socket.on('gameOver', ({ winner }) => {
            setWinner(winner);
            playWin();
        });

        socket.on('chatMessage', (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('connect');
            socket.off('roomState');
            socket.off('roomCreated');
            socket.off('error');
            socket.off('gameOver');
            socket.off('chatMessage');
        };
    }, []);

    const createRoom = useCallback((id, name, maxPlayers, boardSize) => {
        socket.emit('joinRoom', { roomId: id, playerName: name, maxPlayers, boardSize });
        setRoomId(id);
    }, []);

    const joinRoom = useCallback((id, name) => {
        socket.emit('joinRoom', { roomId: id, playerName: name });
        setRoomId(id);
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
            setWinner(null);
        }
    }, [roomId]);

    return {
        socket,
        roomId,
        roomState,
        playerId,
        error,
        winner,
        chatMessages,
        createRoom,
        joinRoom,
        toggleReady,
        playTurn,
        sendMessage,
        restartGame
    };
}
