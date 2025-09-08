import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['ui-serif','Georgia','Cambria','Times New Roman','Times', 'serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
