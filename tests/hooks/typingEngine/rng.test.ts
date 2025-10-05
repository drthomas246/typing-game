import { describe, expect, it } from "vitest";
import { mulberry32, shuffle } from "@/hooks/typingEngine/rng";

describe("mulberry32", () => {
  it("同じシードで同じ系列を生成する（再現性テスト）", () => {
    const seed = 123456;
    const rng1 = mulberry32(seed);
    const rng2 = mulberry32(seed);

    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());

    expect(seq1).toEqual(seq2);
  });

  it("異なるシードでは異なる系列を生成する", () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);

    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());

    expect(seq1).not.toEqual(seq2);
  });

  it("生成値が常に 0〜1 の範囲内である", () => {
    const rng = mulberry32(999);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("shuffle", () => {
  const arr = [1, 2, 3, 4, 5];

  it("同じシードでは同じ順序になる", () => {
    const s1 = shuffle(arr, 42);
    const s2 = shuffle(arr, 42);
    expect(s1).toEqual(s2);
  });

  it("異なるシードでは異なる順序になる（確率的に）", () => {
    const s1 = shuffle(arr, 1);
    const s2 = shuffle(arr, 2);

    expect(s1).not.toEqual(s2);
  });

  it("元の配列を破壊しない（非破壊的）", () => {
    const original = [...arr];
    shuffle(arr, 10);
    expect(arr).toEqual(original);
  });

  it("全要素が保持されている", () => {
    const shuffled = shuffle(arr, 77);
    expect([...shuffled].sort()).toEqual([...arr].sort());
  });
});
