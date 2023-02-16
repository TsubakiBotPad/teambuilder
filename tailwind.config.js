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
    fontSize: {
      xxs: ".6rem",
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem"
    },
    extend: {
      // fontSize: {
      //   xxs: ["10px", "14px"]
      // }
    }
  },
  // temporarily blocklist images until I can move the image directory
  // blocklist: ["bg-[url('/img/assistBind.png')]"],
  corePlugins: {
    preflight: false
  },
  plugins: []
};
