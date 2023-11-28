/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'main-green': '#115e59',
        'background': '#475569',
        'background-dark': '#3d485c',
        'background-light': '#6d7c99',
        'accent-gold': '#ffc154',
        'accent-blue': '#5e92a2',
        'dark-text': '#333333',
        'light-text': '#ffffff',
        'default-gray': '#bdbdbd',
      },
      scale: {
        '25': '0.25',
      },
    },
  },
  plugins: [],
}
