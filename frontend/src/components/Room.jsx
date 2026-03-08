import React from 'react';
import { Copy, CheckCircle, Clock } from 'lucide-react';

export default function Room({ roomState, roomId, playerId, onToggleReady }) {
    if (!roomState) return null;

    const players = roomState.players;
    const me = players.find(p => p.id === playerId);
    const isReady = me?.ready;

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        alert('Room code copied!');
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl">
            <div className="bg-board w-full p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center mb-8">
                <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">Room Code</h2>
                <div className="flex items-center space-x-4 bg-gray-900 px-6 py-3 rounded-xl border border-gray-600">
                    <span className="text-4xl font-mono text-primary font-bold tracking-widest">{roomId}</span>
                    <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                        <Copy className="w-6 h-6" />
                    </button>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                    Waiting for players to join... {players.length}/{roomState.maxPlayers}
                </p>
            </div>

            <div className={`grid gap-4 w-full mb-8 ${roomState.maxPlayers <= 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-5'}`}>
                {Array.from({ length: roomState.maxPlayers }).map((_, index) => {
                    const p = players[index];
                    if (p) {
                        return (
                            <div key={p.id} className="bg-gray-800 p-4 rounded-xl border border-gray-600 flex flex-col items-center relative overflow-hidden">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 text-2xl font-bold
                  ${p.ready ? 'bg-success text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gray-700 text-gray-400'}`}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-white truncate w-full text-center">{p.name}</span>
                                {p.ready ? (
                                    <span className="text-xs text-success flex items-center mt-2 font-bold"><CheckCircle className="w-3 h-3 mr-1" /> Ready</span>
                                ) : (
                                    <span className="text-xs text-gray-400 flex items-center mt-2"><Clock className="w-3 h-3 mr-1" /> Waiting</span>
                                )}
                                {p.id === playerId && (
                                    <div className="absolute top-2 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">You</div>
                                )}
                            </div>
                        );
                    }
                    return (
                        <div key={`empty-${index}`} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed flex flex-col items-center justify-center min-h-[140px]">
                            <span className="text-gray-500 font-medium">Empty Slot</span>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={onToggleReady}
                className={`px-12 py-4 rounded-xl font-bold text-xl transition-all ${isReady
                    ? 'bg-gray-600 text-white hover:bg-gray-500 shadow-lg'
                    : 'bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                    }`}
            >
                {isReady ? 'Cancel Ready' : 'I am Ready!'}
            </button>
        </div>
    );
}
