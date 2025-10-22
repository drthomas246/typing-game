// rspress.config.ts
import path from "node:path";
import { pluginTypeDoc } from "@rspress/plugin-typedoc";
import fg from "fast-glob";
import { defineConfig } from "rspress/config";

// === 対象となる TypeScript ファイル群を探索（テスト・Storyは除外） ===
const rels = fg.sync(
  [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.*",
    "!src/**/*.stories.*",
    "!src/**/*.story.*",
  ],
  { dot: false },
);
const abs = rels.map((p) => path.join(__dirname, p));

// === Rspress 全体設定 ===
export default defineConfig({
  // ★ 出力先を ./docs/manual に変更（デフォルトの doc_build を上書き）
  base: "/manual",
  outDir: "docs/manual",

  // === サイト情報 ===
  globalStyles: path.resolve(__dirname, "./site/styles/global.css"),
  title: "ことばの魔王とえいごの勇者",
  description: "English learning app for students",
  root: "site",

  // === テーマ設定 ===
  themeConfig: {
    prevPageText: "前のページ",
    nextPageText: "次のページ",
    footer: {
      message:
        '<p>CopyRight 2025 <a href="https://www.hobofoto.work">Dr?Thomas</a></p>',
    },
  },

  // === ルーティング設定 ===
  // ★ Ladle のビルド済みアセットを探索対象から除外して SSR 失敗を回避
  route: {
    exclude: ["LadleStorys/**/*"],
  },

  // === ビルド設定（Rsbuild相当） ===
  builderConfig: {
    // Vite の vite-tsconfig-paths 相当（@ を src に解決）
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    output: {
      // ★ outDir に統合したので distPath.root は削除
      // distPath: { root: "./docs/manual" },
      // ★ coverage や LadleStorys をコピーして同梱
      // copy: [
      //   { from: "./coverage", to: "coverage" },
      //   { from: "./LadleStorys", to: "LadleStorys" },
      // ],
    },
  },

  // === プラグイン設定 ===
  plugins: [
    pluginTypeDoc({
      // ★ エントリを明示的に展開（警告を抑制）
      entryPoints: abs,

      // ★ TypeDoc が読む tsconfig を固定（site 用）
      // tsconfig: path.join(__dirname, "tsconfig.site.json"),

      // ★ 出力先を site/api 配下に生成
      outDir: "api",
    }),
  ],
});
