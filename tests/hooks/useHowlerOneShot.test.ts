import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { useHowlerOneShot } from "@/hooks/useHowlerOneShot";

type HowlOpts = {
  src: string[];
  volume?: number;
  preload?: boolean;
};

type Inst = {
  opts: HowlOpts;
  play: Mock<() => void>;
  unload: Mock<() => void>;
};

const mockState: { instances: Inst[] } = {
  instances: [],
};

vi.mock("howler", () => {
  class Howl {
    public opts: HowlOpts;
    public play: Mock<() => void>;
    public unload: Mock<() => void>;

    constructor(opts: HowlOpts) {
      this.opts = opts;
      this.play = vi.fn<() => void>(() => {});
      this.unload = vi.fn<() => void>(() => {});
      mockState.instances.push({
        opts: this.opts,
        play: this.play,
        unload: this.unload,
      });
    }
  }

  return { Howl };
});

beforeEach(() => {
  vi.clearAllMocks();
  mockState.instances.length = 0;
});

describe("useHowlerOneShot", () => {
  it("マウント時に Howl が生成され、play() が実インスタンスに委譲される", () => {
    const src = "/se/keyon.mp3";
    const volume = 0.7;

    const { result } = renderHook(() => useHowlerOneShot(src, volume));

    expect(mockState.instances.length).toBe(1);
    expect(mockState.instances[0].opts).toEqual({
      src: [src],
      volume,
      preload: true,
    });

    act(() => {
      result.current.play();
    });
    expect(mockState.instances[0].play).toHaveBeenCalledTimes(1);
  });

  it("アンマウント時に unload される", () => {
    const src = "/se/slash.mp3";
    const { unmount } = renderHook(() => useHowlerOneShot(src, 0.5));

    expect(mockState.instances.length).toBe(1);
    expect(mockState.instances[0].unload).not.toHaveBeenCalled();

    unmount();
    expect(mockState.instances[0].unload).toHaveBeenCalledTimes(1);
  });

  it("src/volume が変化したら旧インスタンスを unload し、新しい Howl を生成する", () => {
    const { rerender } = renderHook(
      ({ s, v }: { s: string; v?: number }) => useHowlerOneShot(s, v),
      { initialProps: { s: "/se/first.mp3", v: 0.4 } },
    );

    expect(mockState.instances.length).toBe(1);
    expect(mockState.instances[0].opts).toEqual({
      src: ["/se/first.mp3"],
      volume: 0.4,
      preload: true,
    });

    rerender({ s: "/se/second.mp3", v: 0.9 });

    expect(mockState.instances.length).toBe(2);

    expect(mockState.instances[0].unload).toHaveBeenCalledTimes(1);

    expect(mockState.instances[1].opts).toEqual({
      src: ["/se/second.mp3"],
      volume: 0.9,
      preload: true,
    });
  });

  it("volume 省略時は 1.0 が使われる（デフォルト引数の検証）", () => {
    const src = "/se/punch.mp3";

    renderHook(() => useHowlerOneShot(src));

    expect(mockState.instances.length).toBe(1);
    expect(mockState.instances[0].opts).toEqual({
      src: [src],
      volume: 1.0,
      preload: true,
    });
  });
});
