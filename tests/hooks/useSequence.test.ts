import { act, renderHook } from "@testing-library/react";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/**
 * useSequence フックのアニメーション挙動を確認するテスト。
 */
const hoisted = vi.hoisted(() => {
  type AnyObj = Record<string, unknown>;

  class MockControls {
    startCalls: AnyObj[] = [];
    setCalls: AnyObj[] = [];
    stopCalls = 0;

    async start(v: AnyObj) {
      this.startCalls.push(v);
      return;
    }
    async set(v: AnyObj) {
      this.setCalls.push(v);
      return;
    }
    stop() {
      this.stopCalls += 1;
    }
  }

  const animationInstances: MockControls[] = [];
  const useAnimationMock = () => {
    const c = new MockControls();
    animationInstances.push(c);
    return c;
  };

  const nextFrame = vi.fn(async () => {});
  const sleep = vi.fn(async (_ms?: number) => {});
  const preloadImage = vi.fn(async (_src: string) => {});

  const reset = () => {
    animationInstances.length = 0;
    nextFrame.mockClear();
    sleep.mockClear();
    preloadImage.mockClear();
  };

  return {
    MockControls,
    useAnimationMock,
    animationInstances,
    nextFrame,
    sleep,
    preloadImage,
    reset,
  };
});

vi.mock("framer-motion", () => ({
  useAnimation: hoisted.useAnimationMock,
}));

vi.mock("@/lib/nextFrame", () => ({
  nextFrame: hoisted.nextFrame,
  sleep: hoisted.sleep,
}));
vi.mock("@/lib/preloadImage", () => ({
  preloadImage: hoisted.preloadImage,
}));

import { useSequence } from "@/hooks/useSequence";

describe("useSequence", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    hoisted.reset();
  });

  const getCtrls = () => {
    const arr = hoisted.animationInstances;
    expect(arr.length).toBe(5);
    const [title, top, bottom, right, left] = arr;
    return { title, top, bottom, right, left };
  };

  it("reset(): すべての ctrl.stop() が呼ばれ、初期 set が走る", async () => {
    const { result } = renderHook(() =>
      useSequence({
        firstPlayed: true,
        titleSrc: "/title.png",
        onFinishFirst: () => {},
      }),
    );

    const { title, top, bottom, right, left } = getCtrls();

    await act(async () => {
      await result.current.reset();
    });

    expect(title.stopCalls).toBe(1);
    expect(top.stopCalls).toBe(1);
    expect(bottom.stopCalls).toBe(1);
    expect(right.stopCalls).toBe(1);
    expect(left.stopCalls).toBe(1);

    expect(title.setCalls).toContainEqual({
      scale: 0,
      opacity: 0,
      display: "block",
    });
    expect(top.setCalls).toContainEqual({ x: 0, y: 0 });
    expect(bottom.setCalls).toContainEqual({ x: 0, y: 0 });
    expect(right.setCalls).toContainEqual({ x: 0, y: 0 });
    expect(left.setCalls).toContainEqual({ x: 0, y: 0 });

    expect(hoisted.preloadImage).not.toHaveBeenCalled();
    expect(hoisted.nextFrame).not.toHaveBeenCalled();
    expect(hoisted.sleep).not.toHaveBeenCalled();
  });

  it("start(): firstPlayed=false の場合、reset のみ実行して即 return（アニメーションなし）", async () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useSequence({
        firstPlayed: false,
        titleSrc: "/t.png",
        onFinishFirst: onFinish,
      }),
    );

    const { title, top, bottom, right, left } = getCtrls();
    const setShowTooltip = vi.fn();

    await act(async () => {
      await result.current.start(setShowTooltip);
    });

    expect(title.setCalls).toContainEqual({
      scale: 0,
      opacity: 0,
      display: "block",
    });
    expect(top.setCalls).toContainEqual({ x: 0, y: 0 });
    expect(bottom.setCalls).toContainEqual({ x: 0, y: 0 });
    expect(right.setCalls).toContainEqual({ x: 0, y: 0 });
    expect(left.setCalls).toContainEqual({ x: 0, y: 0 });

    expect(hoisted.preloadImage).not.toHaveBeenCalled();
    expect(hoisted.nextFrame).not.toHaveBeenCalled();
    expect(title.startCalls.length).toBe(0);
    expect(setShowTooltip).not.toHaveBeenCalled();
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("start(): firstPlayed=true の場合、期待シーケンスが実行される", async () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useSequence({
        firstPlayed: true,
        titleSrc: "/title.png",
        onFinishFirst: onFinish,
      }),
    );

    const { title, top, bottom, right, left } = getCtrls();
    const setShowTooltip = vi.fn();

    await act(async () => {
      await result.current.start(setShowTooltip);
    });

    expect(hoisted.preloadImage).toHaveBeenCalledTimes(1);
    expect(hoisted.preloadImage).toHaveBeenCalledWith("/title.png");
    expect(hoisted.nextFrame).toHaveBeenCalledTimes(1);

    expect(title.startCalls).toContainEqual({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.9, ease: "easeOut" },
    });

    expect(hoisted.sleep).toHaveBeenCalledWith(2000);

    expect(title.startCalls).toContainEqual({
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    });

    expect(title.setCalls).toContainEqual({ display: "none" });

    expect(top.startCalls).toContainEqual({
      y: "-100%",
      transition: { duration: 1.5, ease: "easeInOut" },
    });
    expect(bottom.startCalls).toContainEqual({
      y: "100%",
      transition: { duration: 1.0, ease: "easeInOut" },
    });
    expect(right.startCalls).toContainEqual({
      x: "100%",
      transition: { duration: 1.0, ease: "easeInOut" },
    });
    expect(left.startCalls).toContainEqual({
      x: "-100%",
      transition: { duration: 1.0, ease: "easeInOut" },
    });

    expect(setShowTooltip).toHaveBeenCalledTimes(1);
    expect(setShowTooltip).toHaveBeenCalledWith(true);
    expect(onFinish).toHaveBeenCalledTimes(1);

    expect(title.setCalls).toContainEqual({
      scale: 0,
      opacity: 0,
      display: "block",
    });
    expect(top.setCalls).toContainEqual({ x: 0, y: 0 });
  });

  it("reset() → start() の順で呼んでも、毎回初期化が走る（idempotent）", async () => {
    const { result } = renderHook(() =>
      useSequence({
        firstPlayed: true,
        titleSrc: "/title.png",
        onFinishFirst: () => {},
      }),
    );
    const { title, top } = getCtrls();
    const setShowTooltip = vi.fn();

    await act(async () => {
      await result.current.reset();
    });

    expect(title.setCalls).toContainEqual({
      scale: 0,
      opacity: 0,
      display: "block",
    });
    expect(top.setCalls).toContainEqual({ x: 0, y: 0 });

    await act(async () => {
      await result.current.start(setShowTooltip);
    });

    const titleInitSetCount = title.setCalls.filter(
      (c) => c.display === "block",
    ).length;
    expect(titleInitSetCount).toBeGreaterThanOrEqual(1);

    expect(hoisted.preloadImage).toHaveBeenCalledWith("/title.png");
    expect(setShowTooltip).toHaveBeenCalledWith(true);
  });
});
