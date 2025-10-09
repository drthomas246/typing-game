import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { useBgm } from "@/hooks/useBgm";

/**
 * useBgm フックが bgmManager を呼び出す様子を検証するテスト。
 */
const mockBGM = vi.hoisted(() => ({
  init: vi.fn<(src: string, defaultVolume?: number, loop?: boolean) => void>(),
  ensurePlaying: vi.fn<(fadeMs?: number, targetVolume?: number) => void>(),
  fadeOutStop: vi.fn<(ms?: number) => void>(),
  stopNow: vi.fn<() => void>(),
  setTargetVolume: vi.fn<(v: number) => void>(),
  getTargetVolume: vi.fn<() => number>().mockReturnValue(0),
}));

vi.mock("@/lib/bgmManager", () => mockBGM);

beforeEach(() => {
  (Object.values(mockBGM) as Mock[]).forEach((fn) => {
    fn.mockClear();
  });
});

describe("useBgm", () => {
  it("マウント時に BGM.init が呼ばれる（第三引数は true 固定）", () => {
    const src = "/bgm/battle.mp3";
    const vol = 0.5;

    renderHook(() => useBgm(src, vol));

    expect(mockBGM.init).toHaveBeenCalledTimes(1);
    expect(mockBGM.init).toHaveBeenCalledWith(src, vol, true);
  });

  it("同一引数での再レンダーでは init は増えない", () => {
    const { rerender } = renderHook(
      ({ s, v }: { s: string; v?: number }) => useBgm(s, v),
      { initialProps: { s: "/bgm/a.mp3", v: 0.4 } },
    );

    expect(mockBGM.init).toHaveBeenCalledTimes(1);

    rerender({ s: "/bgm/a.mp3", v: 0.4 });
    expect(mockBGM.init).toHaveBeenCalledTimes(1);
  });

  it("src が変わると init が再度呼ばれる", () => {
    const { rerender } = renderHook(
      ({ s, v }: { s: string; v?: number }) => useBgm(s, v),
      { initialProps: { s: "/bgm/a.mp3", v: 0.4 } },
    );
    expect(mockBGM.init).toHaveBeenCalledTimes(1);

    rerender({ s: "/bgm/b.mp3", v: 0.4 });
    expect(mockBGM.init).toHaveBeenCalledTimes(2);
    expect(mockBGM.init).toHaveBeenLastCalledWith("/bgm/b.mp3", 0.4, true);
  });

  it("defaultVolume が変わると init が再度呼ばれる", () => {
    const { rerender } = renderHook(
      ({ s, v }: { s: string; v?: number }) => useBgm(s, v),
      { initialProps: { s: "/bgm/a.mp3", v: 0.4 } },
    );
    expect(mockBGM.init).toHaveBeenCalledTimes(1);

    rerender({ s: "/bgm/a.mp3", v: 0.8 });
    expect(mockBGM.init).toHaveBeenCalledTimes(2);
    expect(mockBGM.init).toHaveBeenLastCalledWith("/bgm/a.mp3", 0.8, true);
  });

  it("各メソッドは BGM.* に委譲され、引数が正しく伝播する", () => {
    const { result } = renderHook(() => useBgm("/bgm/a.mp3", 0.5));

    act(() => {
      result.current.ensurePlaying();
      result.current.ensurePlaying(300);
      result.current.ensurePlaying(300, 1);

      result.current.fadeOutStop();
      result.current.fadeOutStop(500);

      result.current.stopNow();

      result.current.setTargetVolume(0.25);
    });

    expect(mockBGM.ensurePlaying).toHaveBeenCalledTimes(3);
    expect(mockBGM.ensurePlaying).toHaveBeenNthCalledWith(
      1,
      undefined,
      undefined,
    );
    expect(mockBGM.ensurePlaying).toHaveBeenNthCalledWith(2, 300, undefined);
    expect(mockBGM.ensurePlaying).toHaveBeenNthCalledWith(3, 300, 1);

    expect(mockBGM.fadeOutStop).toHaveBeenCalledTimes(2);
    expect(mockBGM.fadeOutStop).toHaveBeenNthCalledWith(1, undefined);
    expect(mockBGM.fadeOutStop).toHaveBeenNthCalledWith(2, 500);

    expect(mockBGM.stopNow).toHaveBeenCalledTimes(1);

    expect(mockBGM.setTargetVolume).toHaveBeenCalledTimes(1);
    expect(mockBGM.setTargetVolume).toHaveBeenCalledWith(0.25);
  });

  it("getTargetVolume は BGM.getTargetVolume の戻り値を返す", () => {
    mockBGM.getTargetVolume.mockReturnValueOnce(0.6);

    const { result } = renderHook(() => useBgm("/bgm/a.mp3", 0.5));

    const v = result.current.getTargetVolume();
    expect(mockBGM.getTargetVolume).toHaveBeenCalledTimes(1);
    expect(v).toBe(0.6);
  });
});
