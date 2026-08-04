import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0b3d2e",
          light: "#14624a",
          accent: "#c9a227",
        },
      },
    },
  },
  plugins: [],
};

export default config;
