/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,html}"],
  theme: {
    extend: {
      fontSize: {
        xxs: ["10px", "14px"]
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
};
