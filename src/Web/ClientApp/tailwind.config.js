/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow55: "#FFD11A",
        yellow60: "#FFD633",
        yellow70: "#FFE066",
        yellow80: "#FFEB99",
        yellow90: "#FFF5CC",
        yellow95: "#FFFAE5",
        yellow97: "#FFFCF0",
        yellow99: "#FBFBFE",
        dark08: "#141414",
        dark10: "#1A1A1A",
        dark15: "#262626",
        dark20: "#333333",
        dark25: "#404040",
        dark30: "#4D4D4D",
        dark35: "#595959",
        dark40: "#666666",
        gray50: "#7E7E81",
        gray60: "#98989A",
        gray70: "#B3B3B3",
        gray80: "#CCCCCC",
        gray90: "#E4E4E7",
        gray95: "#F1F1F3",
        gray97: "#F7F7F8",
        gray99: "#FCFCFD",
        
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

