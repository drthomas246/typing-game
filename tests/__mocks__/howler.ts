import { vi } from "vitest";

/**
 * Howler.js の軽量モック（テスト安定化用）
 * - named export: { Howl, Howler }
 * - default export: { Howl, Howler }
 * - fade() 呼び出しで once("fade") に登録したコールバックを即時発火
 * - instances 追跡あり
 */

export type HowlOptions = {
  src: string[];
  loop?: boolean;
  volume?: number;
  html5?: boolean;
};

type FadeListener = () => void;

export const play = vi.fn<() => number>(() => 1);
export const stop = vi.fn<() => void>(() => {});
export const unload = vi.fn<() => void>(() => {});
export const volume = vi.fn<(v?: number) => number>((v?: number) =>
  typeof v === "number" ? v : 1,
);
export const playing = vi.fn<() => boolean>(() => false);

export class Howl {
  static instances: Howl[] = [];

  opts: HowlOptions;
  _onFade?: FadeListener;

  constructor(opts: HowlOptions) {
    this.opts = opts;
    Howl.instances.push(this);
  }

  // 既存互換の関数参照（呼び出し回数検査がしやすい）
  play = play;
  stop = stop;
  unload = unload;
  volume = volume;
  playing = playing;

  /** 本家API: once("fade", cb) を想定 */
  once = vi.fn((event: string, cb: FadeListener) => {
    if (event === "fade") this._onFade = cb;
  });

  /** 本家API: on も一応用意（必要に応じて拡張） */
  on = vi.fn((event: string, cb: (...args: unknown[]) => void) => {
    if (event === "fade") {
      // 一旦 on は keep するが、必要ならここで複数登録に対応
      this._onFade = cb as FadeListener;
    }
  });

  off = vi.fn((event?: string, _cb?: (...args: unknown[]) => void) => {
    if (!event || event === "fade") this._onFade = undefined;
  });

  /** 本家API: fade(from, to, ms) → ここでは同期で fade 完了を通知 */
  fade = vi.fn((_: number, __: number, ___: number) => {
    // 即時に once("fade") を発火
    this._onFade?.();
  });
}

/** Howler: グローバル音量などの名前付き */
export const Howler = {
  volume: vi.fn((v?: number) => (typeof v === "number" ? v : 1)),
};

const defaultExport = { Howl, Howler };
export default defaultExport;
