import React from 'react';
import { MousePointerClick } from 'lucide-react';
import { playPop } from '../utils/sounds';

export default function GameBoard({ roomState, playerId, onPlayTurn }) {
    if (!roomState) return null;

    const players = roomState.players;
    const meIndex = players.findIndex(p => p.id === playerId);
    const me = players[meIndex];

    const isMyTurn = roomState.turnIndex === meIndex;
    const turnPlayer = players[roomState.turnIndex]?.name;

    if (!me || !me.board) return null;

    // Calculate completed lines to highlight them
    const getCompletedLines = () => {
        const boardSize = roomState.boardSize;
        const calledSet = new Set(roomState.calledNumbers);
        const completedRows = [];
        const completedCols = [];

        // Check rows
        for (let i = 0; i < boardSize; i++) {
            let rowComplete = true;
            for (let j = 0; j < boardSize; j++) {
                if (!calledSet.has(me.board[i * boardSize + j])) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) completedRows.push(i);
        }

        // Check columns
        for (let j = 0; j < boardSize; j++) {
            let colComplete = true;
            for (let i = 0; i < boardSize; i++) {
                if (!calledSet.has(me.board[i * boardSize + j])) {
                    colComplete = false;
                    break;
                }
            }
            if (colComplete) completedCols.push(j);
        }

        return { completedRows, completedCols };
    };

    const { completedRows, completedCols } = getCompletedLines();

    const handleCellClick = (number) => {
        if (isMyTurn && !roomState.calledNumbers.includes(number)) {
            playPop();
            onPlayTurn(number);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">

            <div className="flex justify-between w-full mb-6 text-xl tracking-wide bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm font-semibold uppercase">Turn Status</span>
                    <div className="flex items-center space-x-2">
                        <span className={`font-bold ${isMyTurn ? 'text-success animate-pulse' : 'text-primary'}`}>
                            {isMyTurn ? 'YOUR TURN' : `${turnPlayer}'s Turn`}
                        </span>
                        {isMyTurn && <MousePointerClick className="w-5 h-5 text-success" />}
                    </div>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-400 text-sm font-semibold uppercase">Lines Completed</span>
                    <span className="text-2xl font-mono text-accent font-bold drop-shadow-glow-accent">
                        {me.lines} / {roomState.requiredLines}
                    </span>
                </div>
            </div>

            <div className={`bg-board border-4 ${me.lines >= roomState.requiredLines - 1 ? 'border-accent shadow-[0_0_30px_rgba(236,72,153,0.5)]' : 'border-gray-800 shadow-2xl'} rounded-2xl p-4 sm:p-6 mb-8 w-full transition-all duration-500`}>
                <div
                    className="grid gap-2 sm:gap-3 flex-1"
                    style={{ gridTemplateColumns: `repeat(${roomState.boardSize}, minmax(0, 1fr))` }}
                >
                    {me.board.map((number, idx) => {
                        const isCalled = roomState.calledNumbers.includes(number);
                        const row = Math.floor(idx / roomState.boardSize);
                        const col = idx % roomState.boardSize;
                        const isPartOFACompletedLine = completedRows.includes(row) || completedCols.includes(col);

                        return (
                            <button
                                key={idx}
                                onClick={() => handleCellClick(number)}
                                disabled={!isMyTurn || isCalled}
                                className={`
                  aspect-square flex items-center justify-center font-mono font-bold text-lg sm:text-2xl md:text-3xl rounded-xl transition-all duration-300
                  ${isPartOFACompletedLine
                                        ? 'bg-success text-white shadow-glow-accent scale-95 opacity-100 ring-2 ring-white/50 animate-pulse'
                                        : isCalled
                                            ? 'bg-gradient-to-br from-primary to-accent text-white shadow-glow-accent scale-95 opacity-90'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105 border border-gray-600'}
                  ${!isCalled && isMyTurn ? 'hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer' : ''}
                  ${!isCalled && !isMyTurn ? 'cursor-not-allowed' : ''}
                `}
                            >
                                {number}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Opponent Lines Indicator */}
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-3 font-semibold">Opponent Progress</h3>
            <div className="flex w-full space-x-4 overflow-x-auto pb-4 custom-scrollbar">
                {players.map((p, idx) => {
                    if (p.id === playerId) return null;
                    return (
                        <div key={p.id} className="bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-3 flex flex-col min-w-[150px] flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold truncate text-white max-w-[80px]">{p.name}</span>
                                <span className="font-mono text-xs text-primary bg-primary/20 px-2 py-0.5 rounded-full">{p.lines}/{roomState.requiredLines}</span>
                            </div>
                            <div className="w-full bg-gray-900 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${p.lines >= roomState.requiredLines - 1 ? 'bg-accent shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'bg-primary'}`}
                                    style={{ width: `${(p.lines / roomState.requiredLines) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    );
}
