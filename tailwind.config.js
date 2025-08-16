/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fff0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00ff01',
          600: '#00e600',
          700: '#00cc00',
          800: '#00b300',
          900: '#009900',
          950: '#006600',
        },
        neon: {
          green: '#00ff01',
          glow: 'rgba(0, 255, 1, 0.5)',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 5px #00ff01, 0 0 10px #00ff01, 0 0 15px #00ff01',
        'neon-lg': '0 0 10px #00ff01, 0 0 20px #00ff01, 0 0 30px #00ff01',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff01, 0 0 10px #00ff01' },
          '100%': { boxShadow: '0 0 10px #00ff01, 0 0 20px #00ff01, 0 0 30px #00ff01' },
        }
      }
    },
  },
  plugins: [],
}