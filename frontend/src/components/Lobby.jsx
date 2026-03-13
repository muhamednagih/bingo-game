import React, { useState, useEffect } from 'react';
import { Users, LogIn, PlusCircle, XCircle } from 'lucide-react';

export default function Lobby({ onCreate, onJoin }) {
    const [name, setName] = useState(() => localStorage.getItem('playerName') || '');
    const [roomCode, setRoomCode] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [boardSize, setBoardSize] = useState(5);

    const handleCreate = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return alert('Please enter your name.');
        localStorage.setItem('playerName', trimmedName);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        onCreate(code, trimmedName, maxPlayers, boardSize);
    };

    const handleJoin = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return alert('Please enter your name.');
        if (!roomCode.trim()) return alert('Please enter a room code.');
        localStorage.setItem('playerName', trimmedName);
        onJoin(roomCode.toUpperCase(), trimmedName);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-board rounded-2xl shadow-xl border border-gray-700 w-full max-w-lg">
            {/* How to Play Card - Arabic */}
            <div 
                dir="rtl" 
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-center relative overflow-hidden"
            >
                {/* Subtle Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-30 pointer-events-none"></div>
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10 flex text-center justify-center items-center">
                    فكرة اللعبة ببساطة: 🎯
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed relative z-10 font-medium">
                    نافس صحابك في رومات برايفيت.. قفّل صفوف الأرقام (بالطول أو بالعرض) قبلهم،
                    وأول واحد يجمّع عدد الصفوف المطلوبة بيضرب الـ <span className="text-primary font-black uppercase tracking-wider mx-1">BINGO</span> ويكسب الجيم! 🔥
                </p>
            </div>

            <h2 className="text-3xl font-bold flex flex-col items-center mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                <Users className="w-12 h-12 text-primary mb-3" />
                Join the Game
            </h2>

            <div className="w-full space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white pr-10"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {name && (
                            <button
                                onClick={() => setName('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                title="Clear name"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl border border-gray-600">
                        <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider text-center border-b border-gray-700 pb-2">Host Settings</h3>
                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                                <span>Players</span>
                                <span className="text-primary font-bold">{maxPlayers}</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={maxPlayers}
                                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                                    className="w-full appearance-none bg-gray-900/80 backdrop-blur-md border border-gray-600 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer pr-10 shadow-inner"
                                >
                                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num} className="bg-gray-900 text-white font-medium py-2">
                                            {num} Players
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                                <span>Board Size</span>
                                <span className="text-primary font-bold">{boardSize}x{boardSize}</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={boardSize}
                                    onChange={(e) => setBoardSize(parseInt(e.target.value))}
                                    className="w-full appearance-none bg-gray-900/80 backdrop-blur-md border border-gray-600 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer pr-10 shadow-inner"
                                >
                                    {[5, 6, 7, 8, 9, 10].map(size => (
                                        <option key={size} value={size} className="bg-gray-900 text-white font-medium py-2">
                                            {size}x{size} Grid
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center justify-center py-3 mt-2 bg-primary hover:bg-blue-600 transition-colors rounded-lg font-bold shadow-lg shadow-blue-500/30"
                        >
                            <PlusCircle className="mr-2 w-5 h-5" />
                            Create Room
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl border border-gray-600">
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
