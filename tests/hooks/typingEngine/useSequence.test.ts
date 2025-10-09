import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EngineOptions, QAPair } from "@/types/index";

/**
 * useSequence フックの出題順制御を検証するテスト。
 */
const h = vi.hoisted(() => {
  const shuffle = vi.fn<(arr: number[], seed: number) => number[]>(
    (arr: number[]) => [...arr].slice().reverse(),
  );

  const reset = (): void => {
    shuffle.mockClear();
    shuffle.mockImplementation((arr: number[]) => [...arr].slice().reverse());
  };

  return { shuffle, reset };
});

vi.mock("@/hooks/typingEngine/rng", () => ({
  shuffle: h.shuffle,
}));

import { useSequence } from "@/hooks/typingEngine/useSequence";

describe("useSequence (order generator)", () => {
  beforeEach(() => {
    h.reset();
    vi.restoreAllMocks();
  });

  it("randomOrder=true かつ seed 指定時、shuffle(indices, seed) が呼ばれ、order がその戻り値になる", () => {
    const QA: QAPair[] = [
      { ja: "q0", en: "a0" },
      { ja: "q1", en: "a1" },
      { ja: "q2", en: "a2" },
    ];
    const opts: EngineOptions = { randomOrder: true, seed: 42 };

    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(h.shuffle).toHaveBeenCalledTimes(1);
    expect(h.shuffle).toHaveBeenCalledWith([0, 1, 2], 42);

    expect(result.current.order).toEqual([2, 1, 0]);
  });

  it("randomOrder が undefined（省略）なら既定で true として shuffle を呼ぶ", () => {
    const QA: QAPair[] = [
      { ja: "q0", en: "a0" },
      { ja: "q1", en: "a1" },
    ];
    const opts: EngineOptions = { seed: 7 };

    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(h.shuffle).toHaveBeenCalledTimes(1);
    expect(h.shuffle).toHaveBeenCalledWith([0, 1], 7);
    expect(result.current.order).toEqual([1, 0]);
  });

  it("seed 未指定時は Date.now() % 1_000_000 を seed に使う", () => {
    const QA: QAPair[] = [
      { ja: "q0", en: "a0" },
      { ja: "q1", en: "a1" },
      { ja: "q2", en: "a2" },
    ];
    const spy = vi.spyOn(Date, "now").mockReturnValue(1_234_567_890);

    const opts: EngineOptions = { randomOrder: true };
    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(h.shuffle).toHaveBeenCalledWith([0, 1, 2], 567890);
    spy.mockRestore();
  });

  it("randomOrder=false のときは shuffle を呼ばず、order は [0..n-1] のまま", () => {
    const QA: QAPair[] = new Array(5)
      .fill(0)
      .map((_, i) => ({ ja: `q${i}`, en: `a${i}` }));

    const opts: EngineOptions = { randomOrder: false, seed: 999 };
    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(h.shuffle).not.toHaveBeenCalled();
    expect(result.current.order).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("useSequence (getPair mapping)", () => {
  beforeEach(() => {
    h.reset();
    vi.restoreAllMocks();
  });

  it("order を用いて QA を引く（例: order=[2,0,1]）", () => {
    h.shuffle.mockImplementation((_arr: number[], _seed: number) => [2, 0, 1]);

    const QA: QAPair[] = [
      { ja: "Q0", en: "A0" },
      { ja: "Q1", en: "A1" },
      { ja: "Q2", en: "A2" },
    ];
    const opts: EngineOptions = { randomOrder: true, seed: 1 };

    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(result.current.order).toEqual([2, 0, 1]);

    expect(result.current.getPair(0)).toEqual(QA[2]);
    expect(result.current.getPair(1)).toEqual(QA[0]);
    expect(result.current.getPair(2)).toEqual(QA[1]);
  });

  it("order[index] が未定義なら pairIndex=0、QA[0] が返る（安全フォールバック）", () => {
    const QA: QAPair[] = [
      { ja: "Q0", en: "A0" },
      { ja: "Q1", en: "A1" },
    ];
    const opts: EngineOptions = { randomOrder: true, seed: 1 };

    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(result.current.getPair(999)).toEqual(QA[0]);
  });

  it("QA[pairIndex] が未定義でも QA[0] にフォールバック", () => {
    h.shuffle.mockImplementation((_arr: number[], _seed: number) => [10, 0, 1]);

    const QA: QAPair[] = [
      { ja: "Q0", en: "A0" },
      { ja: "Q1", en: "A1" },
    ];
    const opts: EngineOptions = { randomOrder: true, seed: 123 };

    const { result } = renderHook(() => useSequence(QA, opts));

    act(() => {
      result.current.initOrder();
    });

    expect(result.current.getPair(0)).toEqual(QA[0]);

    expect(result.current.getPair(1)).toEqual(QA[0]);
  });
});
