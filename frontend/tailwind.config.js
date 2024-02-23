/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bkg: "var(--primary-color)",
        bkg1: "var(--secondary-color)",
        txt: "var(--text-primary-color)",
        txt1: "var(--text-secondary-color)",

        first: "var(--first-color)",
        second: "var(--second-color)",
        third: "var(--third-color)",
        fourth: "var(--fourth-color)",

      },
      backgroundImage: {
        'hero-pattern': "url('src/assets/images/hero2.png')",
      }
    },
  },
  plugins: [],
}


