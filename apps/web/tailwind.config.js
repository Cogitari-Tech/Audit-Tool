export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable manual dark mode toggle
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Primary Orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        dark: {
          bg: "#0f172a", // Slate 900
          surface: "#1e293b", // Slate 800
          border: "#334155", // Slate 700
        },
      },
      boxShadow: {
        clay: "8px 8px 16px 0px rgba(0, 0, 0, 0.1), -8px -8px 16px 0px rgba(255, 255, 255, 0.8)",
        "clay-dark":
          "8px 8px 16px 0px rgba(0, 0, 0, 0.4), -8px -8px 16px 0px rgba(255, 255, 255, 0.05)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
