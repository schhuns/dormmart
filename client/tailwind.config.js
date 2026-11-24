/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0f2744",
          dark: "#0b1c30",
          blue: "#2563eb",
          light: "#38bdf8",
          accent: "#10b981", // Available status green
          bg: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
};
