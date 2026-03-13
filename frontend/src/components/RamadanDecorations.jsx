import React from 'react';

export default function RamadanDecorations() {
    return (
        <>
            {/* Inline keyframes for all Ramadan animations */}
            <style>{`
                @keyframes ramadan-swing {
                    0%, 100% { transform: rotate(-6deg); }
                    50%       { transform: rotate(6deg); }
                }
                @keyframes moon-pulse {
                    0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 18px rgba(255, 165, 0, 0.3)); opacity: 0.85; }
                    50%       { filter: drop-shadow(0 0 18px rgba(255, 215, 0, 1)) drop-shadow(0 0 36px rgba(255, 165, 0, 0.6)); opacity: 1; }
                }
                @keyframes star-twinkle-a {
                    0%, 100% { opacity: 0.25; transform: scale(0.85); }
                    50%       { opacity: 1;    transform: scale(1.15); }
                }
                @keyframes star-twinkle-b {
                    0%, 100% { opacity: 0.5;  transform: scale(1); }
                    50%       { opacity: 0.15; transform: scale(0.8); }
                }
                .ramadan-swing {
                    transform-origin: top center;
                    animation: ramadan-swing 6s ease-in-out infinite;
                }
                .ramadan-swing-delayed {
                    transform-origin: top center;
                    animation: ramadan-swing 7s ease-in-out infinite;
                    animation-delay: 2.5s;
                }
                .moon-glow {
                    animation: moon-pulse 4s ease-in-out infinite;
                }
            `}</style>

            {/* ── Topmost fixed overlay ── */}
            <div className="fixed inset-0 pointer-events-none z-50 overflow-visible">

                {/* ── Crescent Moon (top-right) ── */}
                <div className="absolute top-6 right-8 md:top-12 md:right-16 moon-glow">
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-20 h-20 md:w-28 md:h-28"
                    >
                        <path
                            d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C60.2078 95 69.6053 91.5649 77.1728 85.8078C58.8239 82.5273 45 66.4795 45 47C45 28.5306 57.6534 13.0645 74.881 8.92095C67.6322 6.41738 59.0435 5 50 5Z"
                            fill="#FFD700"
                        />
                    </svg>
                </div>

                {/* ── Lantern 1 (top-left corner) ── */}
                <div className="absolute top-0 left-8 md:left-20 ramadan-swing">
                    <div className="w-[2px] h-10 md:h-16 bg-gradient-to-b from-transparent to-[#FFD700] mx-auto opacity-80" />
                    <svg
                        viewBox="0 0 28 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-20 md:w-16 md:h-24 mx-auto -mt-px"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.9)) drop-shadow(0 0 20px rgba(255,165,0,0.5))' }}
                    >
                        <defs>
                            <radialGradient id="lg1" cx="50%" cy="50%" r="50%">
                                <stop offset="0%"   stopColor="#FFFDE7" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#FFB300" stopOpacity="0.5"  />
                            </radialGradient>
                        </defs>
                        {/* cap */}
                        <polygon points="14,1 19,7 9,7" fill="#FFD700" />
                        {/* top ring */}
                        <rect x="8" y="7" width="12" height="3" rx="1.5" fill="#FFC107" />
                        {/* body */}
                        <path d="M9 10 H19 L22 26 H6 Z" fill="url(#lg1)" stroke="#FFD700" strokeWidth="1" />
                        {/* decorative ribs */}
                        <line x1="14" y1="10" x2="14" y2="26" stroke="#FFD700" strokeWidth="0.6" strokeOpacity="0.5" />
                        <line x1="11" y1="10" x2="9"  y2="26" stroke="#FFD700" strokeWidth="0.6" strokeOpacity="0.4" />
                        <line x1="17" y1="10" x2="19" y2="26" stroke="#FFD700" strokeWidth="0.6" strokeOpacity="0.4" />
                        {/* bottom ring */}
                        <rect x="6" y="26" width="16" height="3" rx="1.5" fill="#FFC107" />
                        {/* base cap */}
                        <polygon points="9,29 19,29 14,35" fill="#FFD700" />
                        {/* glow dot at center */}
                        <circle cx="14" cy="18" r="3" fill="#FFFDE7" fillOpacity="0.6" />
                    </svg>
                </div>

                {/* ── Lantern 2 (top-center-right) ── */}
                <div className="absolute top-0 right-1/3 ramadan-swing-delayed">
                    <div className="w-[2px] h-12 md:h-20 bg-gradient-to-b from-transparent to-[#FFD700] mx-auto opacity-80" />
                    <svg
                        viewBox="0 0 28 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-9 h-16 md:w-12 md:h-20 mx-auto -mt-px"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.9)) drop-shadow(0 0 16px rgba(255,100,0,0.4))' }}
                    >
                        <defs>
                            <radialGradient id="lg2" cx="50%" cy="50%" r="50%">
                                <stop offset="0%"   stopColor="#FFF9C4" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#FF8F00" stopOpacity="0.45" />
                            </radialGradient>
                        </defs>
                        <polygon points="14,1 19,7 9,7" fill="#FFC107" />
                        <rect x="8" y="7" width="12" height="3" rx="1.5" fill="#FFB300" />
                        <path d="M9 10 H19 L22 26 H6 Z" fill="url(#lg2)" stroke="#FFC107" strokeWidth="1" />
                        <line x1="14" y1="10" x2="14" y2="26" stroke="#FFD700" strokeWidth="0.6" strokeOpacity="0.5" />
                        <rect x="6" y="26" width="16" height="3" rx="1.5" fill="#FFB300" />
                        <polygon points="9,29 19,29 14,35" fill="#FFC107" />
                        <circle cx="14" cy="18" r="2.5" fill="#FFFDE7" fillOpacity="0.55" />
                    </svg>
                </div>

                {/* ── Twinkling Stars ── */}
                {[
                    { top: '12%', left: '8%',   delay: '0s',    dur: '2.8s', size: 18, variant: 'a' },
                    { top: '22%', left: '22%',  delay: '1.4s',  dur: '3.5s', size: 13, variant: 'b' },
                    { top:  '8%', left: '55%',  delay: '0.7s',  dur: '2.2s', size: 20, variant: 'a' },
                    { top: '30%', right: '12%', delay: '2.1s',  dur: '4s',   size: 12, variant: 'b' },
                    { top: '48%', left:  '4%',  delay: '0.3s',  dur: '3.1s', size: 22, variant: 'a' },
                    { top: '62%', right:  '6%', delay: '1.8s',  dur: '2.6s', size: 15, variant: 'b' },
                    { top: '18%', right: '28%', delay: '0.9s',  dur: '3.8s', size: 10, variant: 'a' },
                ].map((star, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            top: star.top,
                            left: star.left,
                            right: star.right,
                            width: star.size,
                            height: star.size,
                            animation: `star-twinkle-${star.variant} ${star.dur} ease-in-out infinite`,
                            animationDelay: star.delay,
                            filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.9)) drop-shadow(0 0 10px rgba(180,100,255,0.5))',
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                                fill="#FFD700"
                            />
                        </svg>
                    </div>
                ))}

            </div>
        </>
    );
}
