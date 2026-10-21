import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  // Ant Design kendi temel stillerini getirdiği için Tailwind'in reset'i kapalı.
  // Böylece buton/input stilleri çakışmaz.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1B5E4B",
          light: "#E7F1EC",
          dark: "#123F33",
        },
        danger: {
          DEFAULT: "#C0392B",
          light: "#FDECEA",
        },
        info: {
          DEFAULT: "#1E63A8",
          light: "#E9F1FA",
        },
        warning: {
          DEFAULT: "#B26B00",
          light: "#FDF2E3",
        },
        ink: "#18201D",
        muted: "#5F6B66",
        surface: "#F6F8F7",
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
