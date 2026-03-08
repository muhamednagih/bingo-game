import React, { useState } from 'react';
import { Users, LogIn, PlusCircle } from 'lucide-react';

export default function Lobby({ onCreate, onJoin }) {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [boardSize, setBoardSize] = useState(5);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert('Please enter your name.');
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        onCreate(code, name, maxPlayers, boardSize);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert('Please enter your name.');
        if (!roomCode.trim()) return alert('Please enter a room code.');
        onJoin(roomCode.toUpperCase(), name);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-board rounded-2xl shadow-xl border border-gray-700 w-full max-w-md">
            <Users className="w-16 h-16 text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Join the Game
            </h2>

            <div className="w-full space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl border border-gray-600">
                        <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider text-center border-b border-gray-700 pb-2">Host Settings</h3>
                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                                <span>Players</span>
                                <span className="text-primary font-bold">{maxPlayers}</span>
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="10"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                                className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                                <span>Board Size</span>
                                <span className="text-primary font-bold">{boardSize}x{boardSize}</span>
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="10"
                                value={boardSize}
                                onChange={(e) => setBoardSize(parseInt(e.target.value))}
                                className="w-full accent-primary h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center justify-center py-3 mt-2 bg-primary hover:bg-blue-600 transition-colors rounded-lg font-bold shadow-lg shadow-blue-500/30"
                        >
                            <PlusCircle className="mr-2 w-5 h-5" />
                            Create Room
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl border border-gray-600 justify-end">
                        <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider text-center border-b border-gray-700 pb-2">Join Room</h3>
                        <div className="flex flex-col gap-2 mt-auto">
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white uppercase text-center"
                                placeholder="ROOM CODE"
                                maxLength={6}
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                            />
                            <button
                                onClick={handleJoin}
                                className="flex items-center justify-center py-2 bg-accent hover:bg-pink-600 transition-colors rounded-lg font-bold shadow-lg shadow-pink-500/30"
                            >
                                <LogIn className="mr-2 w-5 h-5" />
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
