import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b6b6bf",
          400: "#8d8d99",
          500: "#6f6f7c",
          600: "#585863",
          700: "#47474f",
          800: "#2e2e34",
          900: "#1b1b1f",
          950: "#101013",
        },
        accent: {
          400: "#f9694f",
          500: "#e8402a",
          600: "#c92f1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,16,19,0.04), 0 8px 24px rgba(16,16,19,0.06)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
