/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,html}"],
  theme: {
    screens: {
      sm: "576px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 1024px) { ... }

      xl: "1200px",
      // => @media (min-width: 1280px) { ... }
      page: "1440px",
      // => @media (min-width: 1440px) { ... }
      "2xl": "1536px"
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontSize: {
        xxs: ["10px", "14px"]
      }
    }
  },
  // temporarily blocklist images until I can move the image directory
  // blocklist: ["bg-[url('/img/assistBind.png')]"],
  corePlugins: {
    preflight: false
  },
  plugins: [
    require("tailwindcss-alpha")({
      modules: {
        backgroundColors: true
      },
      alpha: {
        // 10: 0.1,
        // 20: 0.2,
        // 30: 0.3,
        40: 0.4
        // 50: 0.5,
        // 60: 0.6,
        // 70: 0.7,
        // 80: 0.8,
        // 90: 0.9
      }
    })
  ]
};
