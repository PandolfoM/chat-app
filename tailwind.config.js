/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        backgroundDark: "#0E0F1E",
        background: "#e3e5e7",
        backgroundSecondary: "#f9fafa",
        primaryDark: "#F300AE",
        primary: "#3e66fb",
        secondary: "#8E39C5",
        customGrey: "#dee1e5",
        card: "#7B61FF",
        error: "#dc3435",
        success: "#72C96E",
        warning: "#E3B23C",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
