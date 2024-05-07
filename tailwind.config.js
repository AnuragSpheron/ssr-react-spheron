import { tailwindPreset } from "@spheron/ui-library";
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tailwindPreset],
  content: [
    "./src/pages/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/@spheron/ui-library/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
