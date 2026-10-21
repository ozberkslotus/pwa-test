import type { ThemeConfig } from "antd";

// Ant Design teması — renkler tailwind.config.ts ile aynı tutulmalı.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1B5E4B",
    colorText: "#18201D",
    colorTextSecondary: "#5F6B66",
    colorBgLayout: "#F6F8F7",
    // tailwind.config.ts içindeki danger / info ile aynı tutulmalı
    colorError: "#C0392B",
    colorInfo: "#1E63A8",
    colorWarning: "#B26B00",
    colorSuccess: "#1B5E4B",
    borderRadius: 12,
    // iOS, 16px altındaki inputlara odaklanınca sayfayı yakınlaştırır.
    // 16px vererek bu davranışı engelliyoruz.
    fontSize: 16,
    controlHeight: 44,
    controlHeightLG: 52,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "none",
    },
    Input: {
      activeShadow: "0 0 0 3px rgba(27, 94, 75, 0.15)",
    },
  },
};
