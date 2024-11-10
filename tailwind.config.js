/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'allotrope': ['allotrope', 'sans-serif']
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'scale-in': 'scale-in 0.3s ease-in-out'
      }
    },
  },
  plugins: [],
};
