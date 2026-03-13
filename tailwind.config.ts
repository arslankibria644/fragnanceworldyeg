import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdf8e7",
          100: "#faefc3",
          200: "#f5de8b",
          300: "#edc84a",
          400: "#d4af37",
          500: "#c9a227",
          600: "#a8821f",
          700: "#82641c",
          800: "#6b5020",
          900: "#5c4420",
        },
        luxury: {
          dark: "#0a0a0a",
          darker: "#050505",
          light: "#f5f0e8",
          cream: "#faf6ef",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #d4af37 0%, #f5de8b 50%, #d4af37 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
      },
      boxShadow: {
        gold: "0 4px 20px rgba(212, 175, 55, 0.3)",
        "gold-lg": "0 8px 40px rgba(212, 175, 55, 0.4)",
        luxury: "0 20px 60px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
