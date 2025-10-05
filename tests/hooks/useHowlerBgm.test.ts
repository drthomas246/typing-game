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

const hoisted = vi.hoisted(() => {
  type FadeListener = () => void;

  let _globalVolume = 1;

  class MockHowl {
    static instances: MockHowl[] = [];
    src: string[];
    loop: boolean;
    preload: boolean;
    html5: boolean;
    _volume: number;
    _playing = false;
    _onceHandlers: Record<string, FadeListener[]> = {};
    stopped = false;
    unloaded = false;

    constructor(opts: {
      src: string[];
      loop: boolean;
      volume: number;
      preload: boolean;
      html5: boolean;
    }) {
      this.src = opts.src;
      this.loop = opts.loop;
      this.preload = opts.preload;
      this.html5 = opts.html5;
      this._volume = opts.volume;
      (this.constructor as typeof MockHowl).instances.push(this);
    }

    play() {
      this._playing = true;
      this.stopped = false;
      return 1;
    }

    stop() {
      this._playing = false;
      this.stopped = true;
    }

    unload() {
      this.unloaded = true;
    }

    volume(v?: number) {
      if (typeof v === "number") this._volume = v;
      return this._volume;
    }

    playing() {
      return this._playing;
    }

    fade(_: number, to: number, _ms: number) {
      this._volume = to;

      setTimeout(() => {
        const listeners = this._onceHandlers.fade ?? [];
        this._onceHandlers.fade = [];
        for (const fn of listeners) fn();
      }, 0);
    }

    once(event: "fade", cb: FadeListener) {
      if (!this._onceHandlers[event]) this._onceHandlers[event] = [];
      this._onceHandlers[event].push(cb);
    }
  }

  const HowlerMock = {
    volume: vi.fn((v?: number) => {
      if (typeof v === "number") {
        _globalVolume = Math.max(0, Math.min(1, v));
        return _globalVolume;
      }
      return _globalVolume;
    }),
  };

  const reset = () => {
    _globalVolume = 1;
    HowlerMock.volume.mockClear();
    MockHowl.instances.length = 0;
  };

  return { MockHowl, HowlerMock, reset };
});

vi.mock("howler", () => ({
  Howl: hoisted.MockHowl,
  Howler: hoisted.HowlerMock,
}));

import { useHowlerBgm } from "@/hooks/useHowlerBgm";

describe("useHowlerBgm", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    hoisted.reset();
  });

  it("初期化: Howler.volume() が 0 なら 1.0 に上げ、Howl が生成/破棄される", () => {
    hoisted.HowlerMock.volume(0);

    const { unmount } = renderHook(() =>
      useHowlerBgm({ src: "/bgm.mp3", defaultVolume: 0.5, loop: true }),
    );

    expect(hoisted.HowlerMock.volume).toHaveBeenCalledWith(1.0);
    expect(hoisted.MockHowl.instances.length).toBe(1);
    const h = hoisted.MockHowl.instances[0];
    expect(h.src).toEqual(["/bgm.mp3"]);
    expect(h.loop).toBe(true);
    expect(h.volume()).toBeCloseTo(0.5);

    unmount();
    expect(h.stopped).toBe(true);
    expect(h.unloaded).toBe(true);
  });

  it("ensurePlaying: 未再生なら 0→target にフェードしつつ play", () => {
    const { result } = renderHook(() =>
      useHowlerBgm({ src: "/bgm2.mp3", defaultVolume: 0.4, loop: false }),
    );
    const h = hoisted.MockHowl.instances[0];

    act(() => {
      result.current.ensurePlaying(800);
      vi.runAllTimers();
    });

    expect(h.playing()).toBe(true);
    expect(h.volume()).toBeCloseTo(0.4);
  });

  it("ensurePlaying: 再生中で音量差があればフェード追従（明示 to）", () => {
    const { result } = renderHook(() =>
      useHowlerBgm({ src: "/bgm3.mp3", defaultVolume: 0.3, loop: true }),
    );
    const h = hoisted.MockHowl.instances[0];

    act(() => {
      result.current.ensurePlaying(200);
      vi.runAllTimers();
    });
    expect(h.playing()).toBe(true);
    expect(h.volume()).toBeCloseTo(0.3);

    act(() => {
      result.current.ensurePlaying(300, 0.8);
      vi.runAllTimers();
    });
    expect(h.volume()).toBeCloseTo(0.8);
  });

  it("setTargetVolume / getTargetVolume: 即時反映", () => {
    const { result } = renderHook(() =>
      useHowlerBgm({ src: "/bgm4.mp3", defaultVolume: 0.2, loop: true }),
    );
    const h = hoisted.MockHowl.instances[0];

    act(() => {
      result.current.setTargetVolume(0.75);
    });
    expect(result.current.getTargetVolume()).toBeCloseTo(0.75);
    expect(h.volume()).toBeCloseTo(0.75);
  });

  it("fadeOutStop: 再生中なら 0→stop→targetVolume に戻る", () => {
    const { result } = renderHook(() =>
      useHowlerBgm({ src: "/bgm5.mp3", defaultVolume: 0.6, loop: true }),
    );
    const h = hoisted.MockHowl.instances[0];

    act(() => {
      result.current.ensurePlaying(100);
      vi.runAllTimers();
    });

    act(() => {
      result.current.setTargetVolume(0.5);
      result.current.fadeOutStop(250);
      vi.runAllTimers();
    });

    expect(h.playing()).toBe(false);
    expect(h.stopped).toBe(true);
    expect(h.volume()).toBeCloseTo(0.5);
  });

  it("stopNow: 即時停止して targetVolume に戻る", () => {
    const { result } = renderHook(() =>
      useHowlerBgm({ src: "/bgm6.mp3", defaultVolume: 0.9, loop: false }),
    );
    const h = hoisted.MockHowl.instances[0];

    act(() => {
      result.current.ensurePlaying(0);
      vi.runAllTimers();
    });

    act(() => {
      result.current.setTargetVolume(0.25);
      result.current.stopNow();
    });

    expect(h.playing()).toBe(false);
    expect(h.stopped).toBe(true);
    expect(h.volume()).toBeCloseTo(0.25);
  });

  it("アンマウント時: stop と unload が呼ばれる", () => {
    const { unmount } = renderHook(() =>
      useHowlerBgm({ src: "/bgm7.mp3", defaultVolume: 0.1 }),
    );
    const h = hoisted.MockHowl.instances[0];

    expect(h.unloaded).toBe(false);
    expect(h.stopped).toBe(false);

    unmount();

    expect(h.stopped).toBe(true);
    expect(h.unloaded).toBe(true);
  });
});
