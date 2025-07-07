/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#6366f1',
        accent: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        surface: '#ffffff',
        background: '#fafafa',
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-optimized': 'spin-optimized 1s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) translateZ(0)' },
          '100%': { transform: 'translateX(100%) translateZ(0)' },
        },
        'spin-optimized': {
          '0%': { transform: 'rotate(0deg) translateZ(0)' },
          '100%': { transform: 'rotate(360deg) translateZ(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        'slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) translateZ(0) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) translateZ(0) scale(1)' 
          },
        },
        'scale-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95) translateZ(0)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateZ(0)' 
          },
        },
      },
    },
  },
  plugins: [],
}