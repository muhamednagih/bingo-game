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

            <div className="flex flex-col gap-4 w-full max-w-md mx-auto mb-8">
                {Array.from({ length: roomState.maxPlayers }).map((_, index) => {
                    const p = players[index];
                    if (p) {
                        return (
                            <div key={p.id} className="bg-gray-800 p-4 rounded-xl border border-gray-600 flex flex-row items-center justify-between relative overflow-hidden h-20">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl font-bold
                  ${p.ready ? 'bg-success text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gray-700 text-gray-400'}`}>
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-white truncate max-w-[150px]">{p.name} {p.id === playerId && '(You)'}</span>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    {p.ready ? (
                                        <span className="text-sm text-success text-right flex items-center font-bold"><CheckCircle className="w-4 h-4 mr-1" /> Ready</span>
                                    ) : (
                                        <span className="text-sm text-gray-400 text-right flex items-center"><Clock className="w-4 h-4 mr-1" /> Waiting</span>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={`empty-${index}`} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed flex items-center justify-center h-20">
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
