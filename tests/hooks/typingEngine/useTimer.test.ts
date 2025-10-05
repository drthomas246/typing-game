import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimer } from "@/hooks/typingEngine/useTimer";

describe("useTimer", () => {
  const TICK = 1000;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("started=false の場合は interval を開始せず、nowMs は初期化時刻のまま", () => {
    const t0 = new Date("2024-01-01T00:00:00.000Z");
    vi.setSystemTime(t0);

    const { result } = renderHook(() => useTimer(TICK, false, false));
    expect(result.current.nowMs).toBe(t0.getTime());

    act(() => {
      vi.advanceTimersByTime(5 * TICK);
    });

    expect(result.current.nowMs).toBe(t0.getTime());
  });

  it("started=true && finished=false の場合、tick 毎に nowMs が更新される", () => {
    const t0 = new Date("2024-01-01T00:00:00.000Z");
    vi.setSystemTime(t0);

    const { result } = renderHook(() => useTimer(TICK, true, false));

    expect(result.current.nowMs).toBe(t0.getTime());

    act(() => {
      vi.advanceTimersByTime(TICK);
    });
    expect(result.current.nowMs).toBe(t0.getTime() + 1 * TICK);

    act(() => {
      vi.advanceTimersByTime(3 * TICK);
    });
    expect(result.current.nowMs).toBe(t0.getTime() + 4 * TICK);
  });

  it("finished=true に切り替えると以降は更新されない（interval が停止される）", () => {
    const spyClearInterval = vi.spyOn(global, "clearInterval");
    const t0 = new Date("2024-01-01T00:00:00.000Z");
    vi.setSystemTime(t0);

    const { result, rerender } = renderHook(
      ({ started, finished }: { started: boolean; finished: boolean }) =>
        useTimer(TICK, started, finished),
      { initialProps: { started: true, finished: false } },
    );

    expect(result.current.nowMs).toBe(t0.getTime());

    act(() => {
      vi.advanceTimersByTime(TICK);
    });
    const t1 = t0.getTime() + 1 * TICK;
    expect(result.current.nowMs).toBe(t1);

    rerender({ started: true, finished: true });
    expect(spyClearInterval).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(5 * TICK);
    });
    expect(result.current.nowMs).toBe(t1);
  });

  it("unmount 時に interval が解放される（clearInterval が呼ばれる）", () => {
    const spyClearInterval = vi.spyOn(global, "clearInterval");
    const t0 = new Date("2024-01-01T00:00:00.000Z");
    vi.setSystemTime(t0);

    const { unmount } = renderHook(() => useTimer(TICK, true, false));
    unmount();
    expect(spyClearInterval).toHaveBeenCalled();
  });
});
