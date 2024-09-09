import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-gradient": "linear-gradient(90deg, #FA00FF, #FF7B7B, #5538CE)",
        "landing-page":"url('https://clusterprotocol2024.s3.amazonaws.com/others/Vector+37.png')",
      },
      colors: {
        black: "#000",
        white: "#fff",
        "famPurple":{
          "light":"",
          "DEFAULT":"#FA00FF",
          "dark":"",
        } ,
        "famViolate":{
          "light":"#7758f0",
          "DEFAULT":"#5538CE",
          "dark":"#3b21a0",
        },
      },
      fontFamily: {
        'famFont':['var(--font-proFont)'],
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwind-scrollbar-hide"), nextui()],
};
export default config;
