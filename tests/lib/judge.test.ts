import { describe, expect, it } from "vitest";
import { judgeChar } from "@/lib/judge";

describe("judgeChar", () => {
  it("同一ケースの正答: ok=true / expected=received", () => {
    const r = judgeChar("Apple", 0, "A");
    expect(r).toEqual({ ok: true, expected: "A", received: "A" });
  });

  it("ASCII の大小無視: 'A' と 'a' は同一視", () => {
    expect(judgeChar("Apple", 1, "p").ok).toBe(true); // 'p' vs 'p'
    expect(judgeChar("Apple", 1, "P").ok).toBe(true); // 'p' vs 'P'
  });

  it("改行(\\n)は常に不正", () => {
    const r = judgeChar("abc", 0, "\n");
    expect(r.ok).toBe(false);
    expect(r.expected).toBe("a");
    expect(r.received).toBe("\n");
  });

  it("バックスペース(\\b)は常に不正", () => {
    const r = judgeChar("abc", 1, "\b");
    expect(r.ok).toBe(false);
    expect(r.expected).toBe("b");
    expect(r.received).toBe("\b");
  });

  it("カーソルが範囲外（長さ超過）: expected は空文字で ok=false", () => {
    const r = judgeChar("hi", 5, "h");
    expect(r).toEqual({ ok: false, expected: "", received: "h" });
  });

  it("数字や記号はそのまま比較", () => {
    expect(judgeChar("123", 1, "2").ok).toBe(true);
    expect(judgeChar("1-3", 1, "-").ok).toBe(true);
    expect(judgeChar("1-3", 1, "_").ok).toBe(false);
  });

  it("非ASCII（例: É/é）は大小無視対象外（現実装仕様）", () => {
    expect(judgeChar("É", 0, "É").ok).toBe(true); // 完全一致は true
    expect(judgeChar("É", 0, "é").ok).toBe(false); // case-insensitive にならない
    expect(judgeChar("A", 0, "a").ok).toBe(true); // 参照: ASCII は同一視
  });

  it("空文字 answerEn でも安全に判定できる", () => {
    const r = judgeChar("", 0, "a");
    expect(r).toEqual({ ok: false, expected: "", received: "a" });
  });

  it("途中位置の判定: 正しい/誤りの例", () => {
    expect(judgeChar("Type", 2, "p").ok).toBe(true); // 'Type'[2] = 'p'
    expect(judgeChar("Type", 2, "x").ok).toBe(false);
  });
});
