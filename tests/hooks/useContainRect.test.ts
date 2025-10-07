import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { useContainRect } from "@/hooks/useContainRect";

/**
 * useContainRect フックの矩形計算を確認するテスト。
 */

function setClientSize(el: HTMLElement, w: number, h: number) {
  Object.defineProperty(el, "clientWidth", { value: w, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: h, configurable: true });
}

function setNaturalSize(img: HTMLImageElement, w: number, h: number) {
  Object.defineProperty(img, "naturalWidth", { value: w, configurable: true });
  Object.defineProperty(img, "naturalHeight", { value: h, configurable: true });
}

describe("useContainRect", () => {
  let imgRef: React.RefObject<HTMLImageElement | null>;
  let wrapRef: React.RefObject<HTMLDivElement | null>;
  let imgEl: HTMLImageElement;
  let wrapEl: HTMLDivElement;

  beforeEach(() => {
    imgRef = React.createRef<HTMLImageElement>();
    wrapRef = React.createRef<HTMLDivElement>();
    imgEl = document.createElement("img");
    wrapEl = document.createElement("div");
    imgRef.current = imgEl;
    wrapRef.current = wrapEl;
  });

  it("横長コンテナ: rCon > rImg の場合は高さ基準 + 左右センタリング", async () => {
    setNaturalSize(imgEl, 800, 600);

    setClientSize(wrapEl, 1200, 600);

    const { result } = renderHook(() => useContainRect(imgRef, wrapRef));

    await waitFor(() => {
      const r = result.current.rect;

      expect(r.h).toBeCloseTo(600);
      expect(r.w).toBeCloseTo(600 * (800 / 600));

      expect(r.x).toBeCloseTo((1200 - 800) / 2);
      expect(r.y).toBeCloseTo(0);
    });
  });

  it("縦長コンテナ: rCon < rImg の場合は幅基準 + 上下センタリング", async () => {
    setNaturalSize(imgEl, 1200, 600);

    setClientSize(wrapEl, 600, 600);

    const { result } = renderHook(() => useContainRect(imgRef, wrapRef));

    await waitFor(() => {
      const r = result.current.rect;

      expect(r.w).toBeCloseTo(600);
      expect(r.h).toBeCloseTo(300);

      expect(r.x).toBeCloseTo(0);
      expect(r.y).toBeCloseTo(150);
    });
  });

  it("naturalWidth / naturalHeight が 0 の場合は更新されない（既定 {0,0,0,0} のまま）", async () => {
    setNaturalSize(imgEl, 0, 0);
    setClientSize(wrapEl, 800, 600);

    const { result } = renderHook(() => useContainRect(imgRef, wrapRef));

    await new Promise((r) => setTimeout(r, 10));
    expect(result.current.rect).toEqual({ x: 0, y: 0, w: 0, h: 0 });
  });

  it("window.resize イベントで再計算される", async () => {
    setNaturalSize(imgEl, 1000, 500);

    setClientSize(wrapEl, 1000, 1000);

    const { result } = renderHook(() => useContainRect(imgRef, wrapRef));

    await waitFor(() => {
      const r = result.current.rect;
      expect(r.w).toBeCloseTo(1000);
      expect(r.h).toBeCloseTo(500);
      expect(r.x).toBeCloseTo(0);
      expect(r.y).toBeCloseTo((1000 - 500) / 2);
    });

    act(() => {
      setClientSize(wrapEl, 1400, 600);
      window.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      const r2 = result.current.rect;

      expect(r2.h).toBeCloseTo(600);
      expect(r2.w).toBeCloseTo(1200);
      expect(r2.x).toBeCloseTo(100);
      expect(r2.y).toBeCloseTo(0);
    });
  });

  it("compute() の明示呼び出しで再計算される", async () => {
    setNaturalSize(imgEl, 900, 900);

    setClientSize(wrapEl, 500, 300);

    const { result } = renderHook(() => useContainRect(imgRef, wrapRef));

    await waitFor(() => {
      const r = result.current.rect;

      expect(r.h).toBeCloseTo(300);
      expect(r.w).toBeCloseTo(300);
      expect(r.x).toBeCloseTo(100);
      expect(r.y).toBeCloseTo(0);
    });

    act(() => {
      setClientSize(wrapEl, 300, 500);
      result.current.compute();
    });

    await waitFor(() => {
      const r2 = result.current.rect;

      expect(r2.w).toBeCloseTo(300);
      expect(r2.h).toBeCloseTo(300);
      expect(r2.x).toBeCloseTo(0);
      expect(r2.y).toBeCloseTo(100);
    });
  });
});
