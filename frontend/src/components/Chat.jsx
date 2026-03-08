import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function Chat({ messages, onSendMessage }) {
    const [msg, setMsg] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (msg.trim()) {
            onSendMessage(msg);
            setMsg('');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-glow hover:scale-110 transition-transform z-50 flex items-center justify-center"
            >
                <MessageSquare className="w-6 h-6" />
                {messages.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-bounce">
                        {messages.length}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Room Chat
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white font-bold px-2">&times;</button>
            </div>

            <div className="flex-1 max-h-64 min-h-64 p-3 overflow-y-auto custom-scrollbar space-y-2 flex flex-col">
                {messages.length === 0 ? (
                    <div className="m-auto text-gray-500 text-sm">No messages yet. Say hi!</div>
                ) : (
                    messages.map((m, i) => (
                        <div key={i} className="text-sm bg-gray-800 p-2 rounded-lg text-gray-100 self-start max-w-[90%]">
                            <span className="font-bold text-primary mr-2 block text-xs mb-0.5">{m.sender}</span>
                            {m.text}
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex space-x-2 bg-gray-800/50">
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Type..."
                    className="flex-1 bg-gray-900 text-sm text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-primary"
                />
                <button type="submit" className="bg-primary hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
