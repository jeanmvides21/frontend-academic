/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Important: Preserve PrimeNG styles
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with PrimeNG
  },
}

