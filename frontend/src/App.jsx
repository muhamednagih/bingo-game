import React from 'react';
import { Home } from 'lucide-react';
import { useGame } from './useGame';
import Lobby from './components/Lobby';
import Room from './components/Room';
import GameBoard from './components/GameBoard';
import WinnerModal from './components/WinnerModal';
import Chat from './components/Chat';
import RamadanDecorations from './components/RamadanDecorations';

function App() {
    const {
        roomId,
        roomState,
        playerId,
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
    } = useGame();

    const isPlaying = roomState?.status === 'playing';
    const isWaiting = roomState?.status === 'waiting';

    return (
        <div className="min-h-screen bg-background text-white flex flex-col items-center py-10 px-4 relative overflow-hidden">

            {/* Background decorations */}
            <RamadanDecorations />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

            <header className="mb-8 z-10 text-center relative w-full flex items-center justify-center min-h-[4rem]">
                {roomId && (
                    <button
                        onClick={leaveRoom}
                        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center bg-gray-800 hover:bg-red-500/80 text-white px-4 py-2 rounded-xl transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] z-20"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline font-semibold">Back to Home</span>
                    </button>
                )}
                <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-400 to-accent drop-shadow-glow flex items-center justify-center">
                    BINGO
                </h1>
            </header>

            {error && (
                <div className="bg-red-500/20 text-red-300 px-6 py-3 rounded-xl mb-6 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] z-10 animate-pulse">
                    {error}
                </div>
            )}

            <main className="w-full h-full flex flex-col items-center z-10">
                {!roomId && (
                    <Lobby onCreate={createRoom} onJoin={joinRoom} />
                )}

                {roomId && isWaiting && (
                    <Room
                        roomId={roomId}
                        roomState={roomState}
                        playerId={playerId}
                        onToggleReady={toggleReady}
                    />
                )}

                {roomId && (isPlaying || roomState?.status === 'ended') && (
                    <GameBoard
                        roomState={roomState}
                        playerId={playerId}
                        onPlayTurn={playTurn}
                    />
                )}
            </main>

            {winners && (
                <WinnerModal winners={winners} onRestart={restartGame} isHost={false} />
            )}

            {roomId && (
                <Chat messages={chatMessages} onSendMessage={sendMessage} />
            )}

        </div>
    );
}

export default App;
