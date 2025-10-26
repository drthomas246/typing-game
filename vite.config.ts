import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// 環境変数 LADLE_ENV でLadleモードかどうかを判断
const isLadle = process.env.LADLE_ENV === "true";

export default defineConfig({
  base: "./",
  plugins: [
    tsconfigPaths(
      isLadle
        ? { ignoreConfigErrors: true } // Ladle用
        : { projects: ["tsconfig.app.json"] }, // 通常Viteビルド用
    ),
    react(),
  ],
  build: {
    outDir: "./docs",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          chakra: ["@chakra-ui/react", "@emotion/react", "@emotion/styled"],
          framer: ["framer-motion"],
          howler: ["howler"],
        },
      },
    },
  },
});
