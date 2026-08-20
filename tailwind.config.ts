import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        surface: "#121821",
        surfaceAlt: "#1A222E",
        border: "#232D3B",
        primary: "#3DDC97",
        primaryMuted: "#2A9D74",
        danger: "#E5484D",
        warning: "#F5A524",
        textPrimary: "#F1F5F9",
        textSecondary: "#8B98A9",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
