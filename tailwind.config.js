/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: "#00FFAA",
        neonBlue: "#00C8FF",
        darkBg: "#0D0D0D",
        darkCard: "#1A1A1A"
      }
    },
  },
  plugins: [],
}



