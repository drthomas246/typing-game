// vitest.config.ts
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ["./tsconfig.app.json"] })],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "src/**/*.d.ts",
      "src/**/*.{test,spec}.{ts,tsx}",
      "**/node_modules/**",
      "**/dist/**",
    ],
    coverage: {
      all: true,
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/__tests__/**",
        "src/**/*.{test,spec}.{ts,tsx}",
        "**/node_modules/**",
        "**/dist/**",
      ],
    },
  },
});
