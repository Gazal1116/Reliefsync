/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#071226',
        surface: '#0b1724',
        elev: '#071926',
        primary: '#7C5CFF',
        accent: '#00D1B2',
        'text-high': '#E6EEF8',
        'text-mid': '#AAB9CC',
        'text-low': '#66788F',
        border: 'rgba(255,255,255,0.02)'
      },
      boxShadow: {
        'soft-dark': '0 12px 40px rgba(6,10,18,0.6)'
      },
      borderRadius: {
        'lg-12': '12px'
      }
    },
  },
  plugins: [],
}