import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

export default function WinnerModal({ winner, onRestart, isHost }) {
    if (!winner) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            <div className="bg-board max-w-sm w-full p-8 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.3)] border border-pink-500/30 flex flex-col items-center transform transition-all scale-100 hover:scale-[1.02]">

                <div className="w-24 h-24 bg-gradient-to-tr from-accent to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-glow-accent animate-bounce">
                    <Trophy className="w-12 h-12 text-white" />
                </div>

                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                    BINGO!
                </h2>

                <p className="text-xl text-center text-gray-300 mb-8 mt-2">
                    <span className="font-bold text-accent">{winner.name}</span> wins the game!
                </p>

                <div className="flex w-full mt-4">
                    <button
                        onClick={onRestart}
                        className="flex-1 flex items-center justify-center py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Play Again
                    </button>
                </div>

            </div>
        </div>
    );
}
