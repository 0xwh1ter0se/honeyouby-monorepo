/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    DEFAULT: '#FFC107', // Amber 500
                    light: '#FFD54F',
                    dark: '#FFA000',
                },
                brown: {
                    DEFAULT: '#795548', // Brown 500
                    light: '#A1887F',
                    dark: '#3E2723', // Dark Brown
                    50: '#EFEBE9',
                },
                yellow: {
                    DEFAULT: '#FFEB3B',
                    light: '#FFF9C4',
                },
                cream: '#FFF8E1', // Amber 50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
