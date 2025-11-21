import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "apple-blue": "#06c",
        "glass": "rgba(255, 255, 255, 0.72)",
      },
      fontSize: {
        hero: "96px",
      },
      borderRadius: {
        apple: "28px",
      },
      maxWidth: {
        container: "980px",
      },
    },
  },
  plugins: [],
};
export default config;
