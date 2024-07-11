/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        background: "#0E0F1E",
        primary: "#F300AE",
        secondary: "#8E39C5",
        card: "#7B61FF",
        error: "#B3001B",
        success: "#72C96E",
        warning: "#E3B23C",
      },
    },
  },
  plugins: [],
};
