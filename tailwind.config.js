/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5D4037", // Brown
        secondary: "#FFD700", // Gold
        accent: "#FFEB3B", // Yellow
        background: "#FFF8E1", // Cream
        dark: "#3E2723",
      },
      fontFamily: {
        sans: ['"Quicksand"', '"Fredoka"', 'sans-serif'], // Cute rounded fonts
      },
    },
  },
  plugins: [],
}
