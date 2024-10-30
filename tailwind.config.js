// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tn-primary': '#1E3A8A', 
        'tn-secondary': '#FFA500', 
        'tn-accent': '#006400', 
      },
      fontFamily: {
        tamil: ['Latha', 'system-ui', 'sans-serif'], // Adding support for Tamil font
      }
    },
  },
  plugins: [],
}