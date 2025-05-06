/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode on class basis
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust paths as needed
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(130deg, rgba(9,28,31,1), rgba(2,10,21,1), rgba(2,11,45,1))",
      },
      colors: {
        primary: {
          light: "var(--primary-light)",
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        secondary1: {
          light: "var(--secondary1-light)",
          DEFAULT: "var(--secondary1)",
          dark: "var(--secondary1-dark)",
        },
        secondary2: {
          light: "var(--secondary2-light)",
          DEFAULT: "var(--secondary2)",
          dark: "var(--secondary2-dark)",
        },
        button: {
          DEFAULT: "var(--button)",
          hover: "var(--button-hover)",
        },
        statusColor: {
          success: "#43A047",
          warning: "#FB8C00",
          error: "#E53935",
          info: "#039BE5",
        },
        text: {
          heading: "var(--text-heading)",
          subheading: "var(--text-subheading)",
          body: "var(--text-body)",
          link: "var(--text-link)",
          linkHover: "var(--text-link-hover)",
          highlighted: "var(--text-highlighted)",
        },
      },
      animation: {
        "spin-slow": "spin 8s linear infinite", // 8 seconds for a full spin
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
