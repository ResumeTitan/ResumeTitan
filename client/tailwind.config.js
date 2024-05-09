/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
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
        '60': '0.60',
        '90': '0.90',
      },
      aspectRatio: {
        resume: '210/296',
      },
    },
  },
  plugins: [],
}
