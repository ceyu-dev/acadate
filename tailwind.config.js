/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#e4e4e4",
        accent: "#685ab3",
        border: "#999999",
      },
    },
  },
  plugins: [],
};
