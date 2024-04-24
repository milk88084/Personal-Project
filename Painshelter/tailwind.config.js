/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        2000: "2000",
        2010: "2010",
        2020: "2020",
      },
      colors: {
        oceanblack: "#161410",
      },
      fontSize: {
        large: "300px",
      },
      left: {
        "2/4": "77%",
      },
      margin: {
        time: "550px",
        content: "500px",
        button: "850px",
      },
      rotate: {
        time: "-6deg",
      },
      width: {
        content: "500px",
      },
    },
  },
  plugins: [],
};
