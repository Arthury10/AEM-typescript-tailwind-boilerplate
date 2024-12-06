module.exports = {
  content: [
    "./src/**/*.html",
    "./src/**/*.ts",
    "./src/**/*.scss",
    "./src/**/*.css",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          100: "#f0f9ff",
          200: "#cfe7fd",
          300: "#accbfa",
          400: "#7fa5f7",
          500: "#5380f4",
          600: "#3c5bd4",
          700: "#2d3eb3",
          800: "#192d92",
          900: "#0a1d78",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
