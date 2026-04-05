/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#0a0a0f',
        'deep-purple': '#1a0a2e',
        'accretion-orange': '#ff6b35',
        'accretion-blue': '#4fc3f7',
        'photon-ring': '#ffd700',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}