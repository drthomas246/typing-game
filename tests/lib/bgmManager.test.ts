import type { MockedFunction } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ===== モック関数の型定義 =====
type FnPlay = () => number;
type FnVoid = () => void;
type FnVolume = (v?: number) => number;
type FnPlaying = () => boolean;
type FnOnce = (event: string, cb: (...args: unknown[]) => void) => void;
type FnOff = (event: string, cb: (...args: unknown[]) => void) => void;
type FnFade = (from: number, to: number, ms: number) => void;

// ===== hoisted mock for howler =====
const h = vi.hoisted(() => {
  const HOWL_EVENTS = ["fade", "end", "load", "play", "stop", "pause"] as const;
  type HowlEvent = (typeof HOWL_EVENTS)[number];
  type HowlEventCallback = (...args: unknown[]) => void;

  function isHowlEvent(e: string): e is HowlEvent {
    return (HOWL_EVENTS as readonly string[]).includes(e);
  }

  type OnceMap = Partial<Record<HowlEvent, { cb: HowlEventCallback }>>;

  class MockHowl {
    static instances: MockHowl[] = [];

    opts: {
      src: string[];
      loop?: boolean;
      volume?: number;
      preload?: boolean;
      html5?: boolean;
    };

    private _playing = false;
    private _volume = 1;
    private _once: OnceMap = {};

    play: MockedFunction<FnPlay>;
    stop: MockedFunction<FnVoid>;
    unload: MockedFunction<FnVoid>;
    volume: MockedFunction<FnVolume>;
    playing: MockedFunction<FnPlaying>;
    once: MockedFunction<FnOnce>;
    off: MockedFunction<FnOff>;
    fade: MockedFunction<FnFade>;

    constructor(opts: {
      src: string[];
      loop?: boolean;
      volume?: number;
      preload?: boolean;
      html5?: boolean;
    }) {
      this.opts = opts;
      this._volume = typeof opts.volume === "number" ? opts.volume : 1;

      this.play = vi.fn<FnPlay>(() => {
        this._playing = true;
        return 1;
      });
      this.stop = vi.fn<FnVoid>(() => {
        this._playing = false;
      });
      this.unload = vi.fn<FnVoid>(() => {});
      this.volume = vi.fn<FnVolume>((v?: number): number => {
        if (typeof v === "number") this._volume = v;
        return this._volume;
      });
      this.playing = vi.fn<FnPlaying>(() => this._playing);

      this.once = vi.fn<FnOnce>((event: string, cb: HowlEventCallback) => {
        if (isHowlEvent(event)) {
          this._once[event] = { cb };
        }
      });
      this.off = vi.fn<FnOff>((event: string, cb: HowlEventCallback) => {
        if (!isHowlEvent(event)) return;
        const cur = this._once[event];
        if (cur && cur.cb === cb) this._once[event] = undefined;
      });

      this.fade = vi.fn<FnFade>((_from, to, _ms) => {
        this._volume = to;
        const entry = this._once["fade"];
        if (entry) {
          this._once["fade"] = undefined;
          entry.cb();
        }
      });

      MockHowl.instances.push(this);
    }
  }

  // ===== 修正版 Howler: アクセサ同期付きクロージャ実装 =====
  type HowlerLike = {
    _volume: number;
    volume: MockedFunction<FnVolume>;
  };

  const Howler: HowlerLike = (() => {
    let vol = 1; // 内部状態（クロージャ）

    const api = {} as HowlerLike;

    Object.defineProperty(api, "_volume", {
      get: () => vol,
      set: (v: number) => {
        vol = v;
      },
      enumerable: true,
      configurable: false,
    });

    api.volume = vi.fn<FnVolume>((v?: number): number => {
      if (typeof v === "number") vol = v;
      return vol;
    });

    return api;
  })();

  return { MockHowl, Howler };
});

vi.mock("howler", () => {
  return {
    Howl: h.MockHowl,
    Howler: h.Howler,
  };
});

// 注意：bgmManager は各テストで「動的 import」する（静的 import はしない）

describe("bgmManager", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    h.MockHowl.instances.length = 0;
    h.Howler._volume = 1;
    h.Howler.volume.mockClear();
    await vi.resetModules();
  });

  it("init: 新規ロードで Howl を生成し、初期音量・ループ設定を渡す", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.5, true);

    expect(h.MockHowl.instances.length).toBe(1);
    const inst = h.MockHowl.instances[0];
    expect(inst.opts.src).toEqual(["./music/a.mp3"]);
    expect(inst.opts.loop).toBe(true);
    expect(inst.opts.volume).toBe(0.5);
    expect(inst.opts.preload).toBe(true);
    expect(inst.opts.html5).toBe(false);
  });

  it("init: 既に同じ src の場合は再生成せず、非フェード時は volume だけ更新", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.5, true);
    const first = h.MockHowl.instances[0];
    mgr.init("./music/a.mp3", 0.8, true);
    expect(h.MockHowl.instances.length).toBe(1);
    expect(first.volume).toHaveBeenCalledWith(0.8);
    expect(mgr.getTargetVolume()).toBe(0.8);
  });

  it("init: 異なる src の場合は stop→unload→再生成", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.4, true);
    const first = h.MockHowl.instances[0];
    mgr.init("./music/b.mp3", 0.6, false);
    expect(first.stop).toHaveBeenCalledTimes(1);
    expect(first.unload).toHaveBeenCalledTimes(1);
    expect(h.MockHowl.instances.length).toBe(2);
    const second = h.MockHowl.instances[1];
    expect(second.opts.src).toEqual(["./music/b.mp3"]);
    expect(second.opts.loop).toBe(false);
    expect(second.opts.volume).toBe(0.6);
  });

  it("init: Howler.master volume が 0 のとき 1.0 に戻す", async () => {
    const mgr = await import("@/lib/bgmManager");
    h.Howler._volume = 0;
    h.Howler.volume.mockClear();
    mgr.init("./music/a.mp3", 0.5, true);
    expect(h.Howler.volume).toHaveBeenCalledWith(1.0);
  });

  it("setTargetVolume / getTargetVolume: フェード中でなければ即時反映", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.2, true);
    const inst = h.MockHowl.instances[0];
    mgr.setTargetVolume(0.9);
    expect(mgr.getTargetVolume()).toBe(0.9);
    expect(inst.volume).toHaveBeenCalledWith(0.9);
  });

  it("ensurePlaying: 未再生→volume(0)→play→fade(0,target,ms)（ms>0）", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.7, true);
    const inst = h.MockHowl.instances[0];
    inst.playing.mockReturnValue(false);
    inst.volume.mockReturnValue(0.3);
    mgr.ensurePlaying(800);
    expect(inst.volume).toHaveBeenCalledWith(0);
    expect(inst.play).toHaveBeenCalledTimes(1);
    expect(inst.fade).toHaveBeenCalledWith(0, 0.7, 800);
  });

  it("ensurePlaying: 再生中で現在音量≠目標→fade(cur,target,ms)（ms>0）", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.5, true);
    const inst = h.MockHowl.instances[0];
    inst.playing.mockReturnValue(true);
    inst.volume.mockReturnValue(0.2);
    mgr.ensurePlaying(300, 0.8);
    expect(inst.fade).toHaveBeenCalledWith(0.2, 0.8, 300);
  });

  it("ensurePlaying: ms<=0 の場合は fade せず volume を即時セット", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.4, true);
    const inst = h.MockHowl.instances[0];
    inst.playing.mockReturnValue(false);
    inst.volume.mockClear();
    inst.play.mockClear();
    inst.fade.mockClear();
    mgr.ensurePlaying(0, 0.9);
    expect(inst.play).toHaveBeenCalledTimes(1);
    expect(inst.fade).not.toHaveBeenCalled();
    const volArgs = inst.volume.mock.calls.map(
      (args: Parameters<FnVolume>) => args[0],
    );
    expect(volArgs).toContain(0.9);
  });

  it("fadeOutStop: 再生中 & 音量>EPS なら fade(cur,0,ms)→完了で stop & volume(target)", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.55, true);
    const inst = h.MockHowl.instances[0];
    inst.playing.mockReturnValue(true);
    inst.volume.mockReturnValue(0.4);
    mgr.fadeOutStop(500);
    expect(inst.fade).toHaveBeenCalledWith(0.4, 0, 500);
    expect(inst.stop).toHaveBeenCalledTimes(1);
    expect(inst.volume).toHaveBeenCalledWith(0.55);
  });

  it("fadeOutStop: 音量が極小(EPS以下)なら即 stop & volume(target)", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.3, true);
    const inst = h.MockHowl.instances[0];
    inst.playing.mockReturnValue(true);
    inst.volume.mockReturnValue(0.001);
    mgr.fadeOutStop(500);
    expect(inst.fade).not.toHaveBeenCalled();
    expect(inst.stop).toHaveBeenCalledTimes(1);
    expect(inst.volume).toHaveBeenCalledWith(0.3);
  });

  it("fadeOutStop: 未再生 or インスタンス無しなら何もしない", async () => {
    const mgr = await import("@/lib/bgmManager");
    expect(() => mgr.fadeOutStop(300)).not.toThrow();
    mgr.init("./music/a.mp3", 0.5, true);
    const inst = h.MockHowl.instances[0];
    inst.playing.mockReturnValue(false);
    mgr.fadeOutStop(300);
    expect(inst.fade).not.toHaveBeenCalled();
    expect(inst.stop).not.toHaveBeenCalled();
  });

  it("stopNow: 即座に stop し、volume(target) を設定", async () => {
    const mgr = await import("@/lib/bgmManager");
    mgr.init("./music/a.mp3", 0.77, true);
    const inst = h.MockHowl.instances[0];
    mgr.stopNow();
    expect(inst.stop).toHaveBeenCalledTimes(1);
    expect(inst.volume).toHaveBeenCalledWith(0.77);
  });
});
