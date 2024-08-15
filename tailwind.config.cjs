/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/**/**/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or false
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#f8f7ff",
          100: "#f6f5ff",
          200: "#eff0fe",
          300: "#e0e0fc",
          400: "#98A5C0",
          500: "#84848f",
          600: "#595983",
          700: "#1e1f48",
          800: "#141430",
          900: "#000000",
        },
        "primary-color": "#AC0A6D",
        "secondary-color": "#FACBD5",
        "primary-green": "#57B06B",
        "secondary-green": "#CFFFDA",
        "secondary-gray": "#EFF5FB",
        "data-table-deleted": "#FEE3DF",
        "primary-blue": "#2F80C5",
        "secondary-blue": "#E0ECF6",
        "primary-gray": "#F5F5F5",
        sidebar: {
          1: "#AC0A6D",
        },
        "g-blue": {
          1: "#2F80C5",
        },
      },
      zIndex: {
        infinity: "999",
      },
    },
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
  },
  variants: {
    extend: {
      backgroundOpacity: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
