module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#060606',
          800: '#1c1d1f',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
