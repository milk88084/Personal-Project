/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        2000: "2000",
        2010: "2010",
      },
      colors: {
        oceanblack: "#161410",
      },
    },
  },
  plugins: [],
};
