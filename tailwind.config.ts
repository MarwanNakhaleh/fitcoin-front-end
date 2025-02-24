import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // Primary: a strong blue that conveys trust—using a slightly lighter tone for light mode and a deeper tone for dark mode
        primary: {
          light: '#1E3A8A',  // e.g., for light mode components
          dark:  '#0D47A1',  // e.g., for dark mode components
        },
        // Secondary: a neon green for high energy, perfect for call-to-action elements and accentuating fitness vibes
        secondary: {
          light: '#00C853',
          dark:  '#00E676',
        },
        // Accent: a warm orange to inject vibrancy and excitement
        accent: {
          light: '#FF6D00',
          dark:  '#FF9800',
        },
        // Background: a light, neutral background for day mode and a sleek, dark background for night mode
        background: {
          light: '#F5F5F5',
          dark:  '#121212',
        },
        // Surface: used for cards, panels, or other elevated UI elements
        surface: {
          light: '#FFFFFF',
          dark:  '#1E1E1E',
        },
        // Text: ensuring readability with contrasting tones
        text: {
          light: '#212121',
          dark:  '#E0E0E0',
        },
      },
    },
  },
  plugins: [],
};
export default config;
