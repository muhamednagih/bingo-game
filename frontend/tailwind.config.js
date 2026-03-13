/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f172a',
                primary: '#3b82f6',
                secondary: '#6366f1',
                accent: '#ec4899',
                board: '#1e293b',
                success: '#10b981',
            },
            fontFamily: {
                'pixel': ['"Press Start 2P"', 'cursive'],
            },
            dropShadow: {
                'glow': '0 0 10px rgba(59, 130, 246, 0.5)',
                'glow-accent': '0 0 15px rgba(236, 72, 153, 0.7)',
                'glow-success': '0 0 15px rgba(16, 185, 129, 0.7)',
                'glow-gold': '0 0 15px rgba(255, 215, 0, 0.7)',
            },
            keyframes: {
                twinkle: {
                    '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.1)' },
                },
                swing: {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                }
            },
            animation: {
                twinkle: 'twinkle 3s ease-in-out infinite',
                swing: 'swing 6s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
