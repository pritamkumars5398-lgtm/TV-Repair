import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEEFFF',
          100: '#CCCFFF',
          200: '#999FFF',
          500: '#1A23DE',
          600: '#0009C2',
          700: '#0007A0',
          900: '#00045A',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        neutral: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          400: '#94a3b8',
          600: '#475569',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
        info:    '#06b6d4',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        marquee2: 'marquee2 45s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
