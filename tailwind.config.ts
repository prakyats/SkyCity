import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        heading: ["var(--font-dm-serif)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        label: ["var(--font-tenor)", "Arial", "sans-serif"],
        // Legacy aliases
        sans:  ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      colors: {
        navy:    { DEFAULT: "#07111f", mid: "#0f2035", light: "#1b3a6b", deep: "#040c16" },
        gold:    { DEFAULT: "#E8A020", bright: "#F5C842", dark: "#B07818" },
        cream:   "#f3eae1",
        sand:    "#e0d9c7",
        "near-black": "#1c1213",
        "warm-dark":  "#1a1408",
        "off-white":  "#F0EDE8",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2.5rem",   /* Vitu 40px */
        "5xl": "3rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gold-gradient": "linear-gradient(135deg, #b8820a 0%, #f0c840 30%, #e8a020 55%, #f5d060 78%, #a87010 100%)",
      },
      letterSpacing: {
        widest2: "0.35em",
        widest3: "0.5em",
      },
      animation: {
        "ping-slow": "ping 2.5s cubic-bezier(0,0,0.2,1) infinite",
        "fade-up": "fadeUp 0.7s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;