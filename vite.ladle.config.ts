import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tsconfigPaths({
      ignoreConfigErrors: true, // ← ladle側ではこれが重要！
    }),
  ],
  build: { outDir: "./docs" },
});
