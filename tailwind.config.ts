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
        remax: {
          blue: "#003DA5", // Primary Blue RGB(0, 61, 165)
          red: "#E11B22",  // Primary Red RGB(225, 27, 34)
          navy: "#003DA5", // Alias for blue (backward compatibility)
          slate: "#63666A", // Neutral accent
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        remax: ["Arial", "Gotham", "Berthold Akzidenz Grotesk", "sans-serif"],
      },
      spacing: {
        'logo-clear-x': '0.5em', // Half height of 'X' - mandatory clear space
        'logo-clear-m': '0.15em', // Width of 'M' stroke - horizontal separation
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
