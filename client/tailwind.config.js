/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#050508',
        surface: '#0D0D14',
        'surface-2': '#12121C',
        'surface-3': '#1A1A2E',
        violet: {
          primary: '#7C3AED',
          light: '#8B5CF6',
          dark: '#6D28D9',
        },
        cyan: {
          accent: '#06B6D4',
        },
        emerald: {
          accent: '#10B981',
        },
        text: {
          primary: '#F0F0F5',
          secondary: '#6B7280',
          muted: '#374151',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': '12px',
        xs: '14px',
        sm: '16px',
        md: '20px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      backgroundImage: {
        'gradient-violet-cyan': 'linear-gradient(135deg, #7C3AED, #06B6D4)',
        'gradient-hero': 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 60%)',
        'grid-pattern': 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.3)',
        'card': '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 8px 40px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      borderColor: {
        subtle: 'rgba(124,58,237,0.15)',
        'subtle-light': 'rgba(124,58,237,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'ticker': 'ticker 20s linear infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
