/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'allotrope': ['allotrope', 'sans-serif']
      }
    },
  },
  plugins: [],
  extend: {
    backgroundColor: {
      'highlight': '#fff3cd',
    },
    textColor: {
      'highlight': '#856404',
    },
  },
};
