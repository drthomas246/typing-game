import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { useHowlerBgmOpts } from "@/types/index";

/**
 * useBgm フックの再生制御を確認するテスト。
 */
const h = vi.hoisted(() => {
  type HowlOpts = {
    src: string[];
    loop?: boolean;
    volume?: number;
    html5?: boolean;
  };

  class MockHowl {
    static instances: MockHowl[] = [];

    opts: HowlOpts;
    private _playing = false;
    stopped = false;
    unloaded = false;

    play: () => number;
    stop: () => void;
    unload: () => void;
    playing: () => boolean;

    constructor(opts: HowlOpts) {
      this.opts = opts;

      this.play = vi.fn<() => number>(() => {
        this._playing = true;
        this.stopped = false;
        return 1;
      });

      this.stop = vi.fn<() => void>(() => {
        this._playing = false;
        this.stopped = true;
      });

      this.unload = vi.fn<() => void>(() => {
        this.unloaded = true;
      });

      this.playing = vi.fn<() => boolean>(() => this._playing);

      (this.constructor as typeof MockHowl).instances.push(this);
    }

    static reset(): void {
      MockHowl.instances.length = 0;
    }
  }

  const resetAll = (): void => {
    MockHowl.reset();
  };

  return { MockHowl, resetAll };
});

vi.mock("howler", () => ({
  Howl: h.MockHowl,
}));

import { useBgm } from "@/hooks/typingPage/useBgm";

type BgmProps = useHowlerBgmOpts & {
  enabled: boolean;
  /** テスト用：実装側で defaultVolume にマップされる想定の音量 */
  volume?: number;
};

describe("useBgm", () => {
  beforeEach(() => {
    h.resetAll();
    vi.restoreAllMocks();
  });

  it("enabled=true 初期マウント: Howl を生成し play() を 1 回呼ぶ（オプション反映）", () => {
    const opts: BgmProps = {
      src: "/bgm.mp3",
      loop: false,
      volume: 0.5,
      enabled: true,
    };
    const { result } = renderHook(() => useBgm(opts));

    expect(h.MockHowl.instances.length).toBe(1);
    const inst = h.MockHowl.instances[0];

    expect(inst.opts).toEqual({
      src: ["/bgm.mp3"],
      loop: false,
      volume: 0.5,
      html5: true,
    });

    expect(inst.play).toHaveBeenCalledTimes(1);
    expect(inst.playing()).toBe(true);

    expect(result.current.shouldPlay).toBe(true);
  });

  it("enabled=false 初期マウント: インスタンスを作らない", () => {
    const { result } = renderHook(() =>
      useBgm({ src: "/bgm.mp3", enabled: false } as BgmProps),
    );

    expect(h.MockHowl.instances.length).toBe(0);
    expect(result.current.shouldPlay).toBe(false);
  });

  it("enabled のトグル: false→true で生成+再生、true→false で stop+unload+null", () => {
    const initial: BgmProps = {
      src: "/bgm.mp3",
      enabled: false,
      loop: true,
      volume: 0.4,
    };
    const { rerender } = renderHook((p: BgmProps) => useBgm(p), {
      initialProps: initial,
    });

    expect(h.MockHowl.instances.length).toBe(0);

    act(() => {
      rerender({ ...initial, enabled: true });
    });

    expect(h.MockHowl.instances.length).toBe(1);
    const inst = h.MockHowl.instances[0];
    expect(inst.play).toHaveBeenCalledTimes(1);
    expect(inst.playing()).toBe(true);

    act(() => {
      rerender({ ...initial, enabled: false });
    });

    expect(inst.stop).toHaveBeenCalledTimes(1);
    expect(inst.unload).toHaveBeenCalledTimes(1);
    expect(inst.unloaded).toBe(true);
  });

  it("すでに再生中（playing=true）の場合、効果は早期 return し play を追加で呼ばない", () => {
    const { rerender } = renderHook((p: BgmProps) => useBgm(p), {
      initialProps: { src: "/a.mp3", enabled: true, loop: true, volume: 0.4 },
    });

    expect(h.MockHowl.instances.length).toBe(1);
    const inst = h.MockHowl.instances[0];
    expect(inst.play).toHaveBeenCalledTimes(1);

    act(() => {
      rerender({ src: "/a.mp3", enabled: true, loop: true, volume: 0.9 });
    });

    expect(h.MockHowl.instances.length).toBe(1);
    expect(inst.play).toHaveBeenCalledTimes(1);
    expect(inst.stop).not.toHaveBeenCalled();
    expect(inst.unload).not.toHaveBeenCalled();
  });

  it("setShouldPlay(false/true) で手動トグルできる（停止→新規作成＋再生）", () => {
    const { result } = renderHook(() =>
      useBgm({ src: "/bgm.mp3", enabled: true } as BgmProps),
    );

    expect(h.MockHowl.instances.length).toBe(1);
    const first = h.MockHowl.instances[0];
    expect(first.play).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setShouldPlay(false);
    });
    expect(first.stop).toHaveBeenCalledTimes(1);
    expect(first.unload).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setShouldPlay(true);
    });
    expect(h.MockHowl.instances.length).toBe(2);
    const second = h.MockHowl.instances[1];
    expect(second.play).toHaveBeenCalledTimes(1);
    expect(second.playing()).toBe(true);
  });
});
