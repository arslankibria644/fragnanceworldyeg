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
        forest: {
          50: "#eef5f0",
          100: "#d7e9dd",
          200: "#aed3bb",
          300: "#7fb795",
          400: "#4f9670",
          500: "#2f7855",
          600: "#1f6043",
          700: "#1a4d38",
          800: "#163d2d",
          900: "#0f2d21",
        },
        luxury: {
          dark: "#0f2d21",
          darker: "#0a2018",
          light: "#eef5f0",
          cream: "#f4f9f5",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.7s ease-out forwards",
        "slide-in": "slideIn 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
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
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(212, 175, 55, 0)" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(31, 96, 67, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(31, 96, 67, 0)" },
        },
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #d4af37 0%, #f5de8b 50%, #d4af37 100%)",
        "green-gradient":
          "linear-gradient(135deg, #1f6043 0%, #2f7855 50%, #1f6043 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #0f2d21 0%, #1a4d38 50%, #0f2d21 100%)",
      },
      boxShadow: {
        gold: "0 4px 20px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 8px 40px rgba(212, 175, 55, 0.35)",
        green: "0 4px 20px rgba(31, 96, 67, 0.22)",
        "green-lg": "0 8px 40px rgba(31, 96, 67, 0.3)",
        luxury: "0 25px 60px rgba(15, 45, 33, 0.12)",
        "luxury-lg": "0 40px 80px rgba(15, 45, 33, 0.15)",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
