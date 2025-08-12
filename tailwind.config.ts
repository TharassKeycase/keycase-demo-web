/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        primary: "#4d4edd",
        secondary: "#e4a222",
        online: "#36be64",
        error: "#f15454",
        icon: "#1d206d",
        divider: "#0b119a",
        background: "#f2f4f9",
        unSelected: "#f6f6fd"
      },
      fontSize: {
        base: "0.75rem",
        lg: "0.875rem",
        xl: "1rem"
      },
      boxShadow: {
        "el/24":
          "0px 11px 15px -7px rgba(11,17,154,0.08), 0px 24px 38px 3px rgba(11,17,154,0.04), 0px 9px 46px 8px rgba(11,17,154,0.08)",
        "el/6":
          "0px 3px 5px -1px rgba(11,17,154,0.1), 0px 6px 10px 0px rgba(11,17,154,0.04), 0px 1px 18px 0px rgba(11,17,154,0.08)"
      },
      maxHeight: {
        param: "calc( 100vh - 300px )"
      }
    }
  },
  plugins: []
};
