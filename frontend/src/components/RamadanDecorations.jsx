import React from 'react';

export default function RamadanDecorations() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Glowing Crescent Moon */}
            <div className="absolute top-10 right-10 md:top-16 md:right-20 opacity-80 drop-shadow-glow-gold mix-blend-screen">
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 md:w-32 md:h-32"
                >
                    <path
                        d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C60.2078 95 69.6053 91.5649 77.1728 85.8078C58.8239 82.5273 45 66.4795 45 47C45 28.5306 57.6534 13.0645 74.881 8.92095C67.6322 6.41738 59.0435 5 50 5Z"
                        fill="#FFD700"
                    />
                </svg>
            </div>

            {/* Swinging Lanterns */}
            <div className="absolute top-0 left-10 md:left-24 origin-top animate-swing drop-shadow-glow-gold">
                {/* Lantern String */}
                <div className="w-[2px] h-12 md:h-20 bg-gradient-to-b from-transparent to-[#FFD700] mx-auto opacity-70"></div>
                {/* Lantern Body */}
                <svg
                    width="60"
                    height="80"
                    viewBox="0 0 24 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-16 md:w-14 md:h-20 mx-auto -mt-1"
                >
                    <path
                        d="M12 2L16 6H8L12 2Z"
                        fill="#FFD700"
                        className="opacity-90"
                    />
                    <path
                        d="M7 6H17L19 18H5L7 6Z"
                        fill="url(#lantern-glow)"
                        stroke="#FFD700"
                        strokeWidth="1"
                    />
                    <path
                        d="M12 28L16 24H8L12 28Z"
                        fill="#FFD700"
                        className="opacity-90"
                    />
                    <path
                        d="M6 18H18L16 24H8L6 18Z"
                        stroke="#FFD700"
                        strokeWidth="1"
                        fill="#b8860b"
                        className="opacity-80"
                    />
                    <defs>
                        <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="#FFFACD" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.4" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            <div className="absolute top-0 right-1/4 origin-top animate-swing drop-shadow-glow-gold" style={{ animationDelay: '2s' }}>
                <div className="w-[2px] h-16 md:h-24 bg-gradient-to-b from-transparent to-[#FFD700] mx-auto opacity-70"></div>
                <svg
                    width="50"
                    height="70"
                    viewBox="0 0 24 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-12 md:w-10 md:h-14 mx-auto -mt-1"
                >
                    <path d="M12 2L15 6H9L12 2Z" fill="#FFD700" />
                    <path d="M8 6H16L18 16H6L8 6Z" fill="url(#lantern-glow-sm)" stroke="#FFD700" />
                    <path d="M12 24L15 20H9L12 24Z" fill="#FFD700" />
                    <path d="M7 16H17L15 20H9L7 16Z" stroke="#FFD700" fill="#b8860b" />
                    <defs>
                        <radialGradient id="lantern-glow-sm" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FFFACD" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.3" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Twinkling Stars */}
            {/* Array of positions to scatter some stars */}
            {[
                { top: '15%', left: '10%', delay: '0s', size: 'w-4 h-4' },
                { top: '25%', left: '25%', delay: '1.5s', size: 'w-3 h-3' },
                { top: '10%', right: '35%', delay: '0.5s', size: 'w-5 h-5' },
                { top: '35%', right: '15%', delay: '2s', size: 'w-3 h-3' },
                { top: '50%', left: '5%', delay: '1s', size: 'w-6 h-6' },
                { top: '65%', right: '5%', delay: '2.5s', size: 'w-4 h-4' },
            ].map((star, i) => (
                <div
                    key={i}
                    className={`absolute animate-twinkle drop-shadow-glow-gold ${star.size}`}
                    style={{
                        top: star.top,
                        left: star.left,
                        right: star.right,
                        animationDelay: star.delay
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                            fill="#FFD700"
                            className="opacity-70"
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
}
