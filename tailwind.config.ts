import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        line: "#D7DEE5",
        sea: "#0E6F73",
        mint: "#DDF3EF",
        gold: "#B7791F",
        coral: "#C2413B",
        paper: "#F6F8F7"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(23, 32, 38, 0.08)",
        lift: "0 18px 45px rgba(23, 32, 38, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
