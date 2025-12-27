import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        emerald: {
          "50": "#e6f7f1",   // very light emerald
          "100": "#b3ebda",  // light emerald
          "200": "#80dfc4",  // soft emerald
          "300": "#4dd4ad",  // medium light emerald
          "400": "#26c99c",  // medium emerald
          "500": "#00bf8a",  // base emerald
          "600": "#00a677",  // medium dark emerald
          "700": "#008d65",  // darker emerald
          "800": "#007454",  // deep emerald
          "900": "#005b43"   // very deep emerald
        },
        brand: {
          "50": "#e6f7f1",
          "100": "#b3ebda",
          "200": "#80dfc4",
          "300": "#4dd4ad",
          "400": "#26c99c",
          "500": "#00bf8a",
          "600": "#00a677",
          "700": "#008d65",
          "800": "#007454",
          "900": "#005b43"
        },
        accent: {
          DEFAULT: '#ffbf00', // Amber
          hover: '#ffd700',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;