/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'main-green': '#115e59',
        'dark-green': '#0e4a45',
        'darker-green': '#0b3733',
        'darkest-green': '#082421',
        'lightest-green': '#e0f2f1',
        'lighter-green': '#b2dfdb',
        'light-green': '#80cbc4',
        'main-opposite': '#59115e',
        'analaogous-green': '#115e45',
        'analaogous-blue': '#115e73',
        'background': '#475569',
      },
      scale: {
        '25': '0.25',
        '60': '0.60',
        '90': '0.90',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: 0.5,
          },
          '50%': {
            opacity: 0.2,
          },
        },
      }
    },
  },
  plugins: [],
}
