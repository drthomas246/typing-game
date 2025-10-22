import fs from "node:fs";
import path from "node:path";

const src = path.resolve("./tests/custom/base.css"); // 自作のCSS
const dst = path.resolve("docs", "manual", "coverage", "base.css"); // 出力先に上書き
if (fs.existsSync(dst)) {
  fs.copyFileSync(src, dst);
  console.log("✅ base.css を上書きしました");
} else {
  console.error("⚠️ coverage/base.css が見つかりません");
}
