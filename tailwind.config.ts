import type { Config } from "tailwindcss";

/**
 * Yamuna Sky City official brand palette. The CSS custom properties in
 * globals.css are the source of truth; these entries only expose the same
 * values to Tailwind utilities.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      colors: {
        ember: { DEFAULT: "#B42810", dark: "#8D1F0C" },
        ivory: "#F7F0E6",
        "mist-grey": "#C6C7C8",
      },
      screens: {
        // The floor rail only has room from this width up.
        rail: "1100px",
      },
    },
  },
  plugins: [],
};
export default config;
