// ------------------------------
// 基本セットアップ
// ------------------------------
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "fake-indexeddb/auto";

// Testing Library: 自動クリーンアップ
afterEach(() => cleanup());

// ------------------------------
// グローバル Polyfill / Stub
// ------------------------------

// speechSynthesis モック（既存を踏襲）
Object.defineProperty(global, "speechSynthesis", {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: () => [],
  },
  writable: true,
});

// Image の軽量スタブ（既存を踏襲）
class FakeImage {
  onload: null | (() => void) = null;
  onerror: null | ((e?: any) => void) = null;
  set src(_v: string) {
    // 同期すぎると崩れるケースがあるため queueMicrotask のまま
    queueMicrotask(() => this.onload && this.onload());
  }
}
vi.stubGlobal("Image", FakeImage as any);

// matchMedia: 無いときだけ polyfill（next-themes / Chakra 等が参照）
if (typeof window !== "undefined" && !("matchMedia" in window)) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(), // 旧API互換
      removeListener: vi.fn(), // 旧API互換
      dispatchEvent: vi.fn(),
    }),
  });
}

// requestAnimationFrame / cancelAnimationFrame: 無いときだけ polyfill
if (typeof window !== "undefined" && !("requestAnimationFrame" in window)) {
  (window as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 16) as unknown as number;
}
if (typeof window !== "undefined" && !("cancelAnimationFrame" in window)) {
  (window as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// ResizeObserver: 無いときだけ polyfill（レイアウト計測系の警告防止）
if (!(global as any).ResizeObserver) {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ------------------------------
// ライブラリの安定化モック
// ------------------------------

// next-themes はブラウザ依存が強いので最小モックに差し替え
vi.mock("next-themes", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    ThemeProvider: (props: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, props.children),
    useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
  };
});

// Framer Motion: 同期モック（非アニメ化）※既存を統合
// --- Framer Motion: 呼び出し型 + dot形式 両対応 & useAnimation 付き（ESM-safe） ---
vi.mock("framer-motion", async () => {
  const React = await import("react"); // ← ESM の動的 import（require禁止）

  type AnyEl = HTMLElement;
  type AnyProps = React.HTMLAttributes<HTMLElement>;

  const wrap = (Comp: any) =>
    React.forwardRef<AnyEl, AnyProps>(function FMStub(props, ref) {
      return React.createElement(
        Comp as any,
        { ...props, ref },
        props?.children,
      );
    });

  // 関数として: motion(Component)
  const callable = (Comp: any) => wrap(Comp);

  // dot 形式: motion.div / motion.span など
  const motion = new Proxy(callable as any, {
    get: (_t, tag: string) => wrap(tag),
  });

  // useAnimation が返す最小コントロール
  const makeControls = () => ({
    start: vi.fn(async () => undefined),
    stop: vi.fn(() => undefined),
    set: vi.fn(() => undefined),
  });

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useReducedMotion: () => true,
    useAnimation: () => makeControls(), // ★ これが必要
  };
});
// Howler: 同期モック（既存を統合）
vi.mock("howler", () => {
  class Howl {
    static instances: Howl[] = [];
    _playing = false;
    _volume = 1;
    _onFade?: () => void;

    constructor(_opts: any) {
      Howl.instances.push(this);
    }
    play = vi.fn(() => {
      this._playing = true;
      return 1;
    });
    stop = vi.fn(() => {
      this._playing = false;
    });
    unload = vi.fn(() => {
      this._playing = false;
    });
    volume = vi.fn((v?: number) => {
      if (typeof v === "number") this._volume = v;
      return this._volume;
    });
    once = vi.fn((evt: string, cb: () => void) => {
      if (evt === "fade") this._onFade = cb;
    });
    off = vi.fn((_evt?: string, _cb?: () => void) => {
      this._onFade = undefined;
    });
    fade = vi.fn((_from: number, _to: number, _ms: number) => {
      this._onFade?.(); // 即完了
    });
    // ★ 追加：bgmManager.fadeOutStop() から呼ばれる
    playing = vi.fn(() => this._playing);
  }
  const Howler = {
    volume: vi.fn((v?: number) => (typeof v === "number" ? v : 1)),
  };
  return { __esModule: true, Howl, Howler };
});

// ⚠️ 注意: グローバルの vi.useFakeTimers()/vi.setSystemTime() はここで設定しない
// → 各テスト内で必要に応じて opt-in する方針
// --- react-konva をダミーの素通しコンポーネントにモック ---
vi.mock("react-konva", async () => {
  const React = await import("react");
  const passthrough = (tag: keyof HTMLElementTagNameMap) =>
    function C(props: any) {
      return React.createElement(tag, props, props?.children);
    };
  return {
    __esModule: true,
    // よく使う要素だけで十分（必要に応じて追加）
    Stage: passthrough("div"),
    Layer: passthrough("div"),
    Group: passthrough("div"),
    Rect: passthrough("div"),
    Circle: passthrough("div"),
    Line: passthrough("div"),
    Text: passthrough("span"),
    Image: passthrough("img"),
  };
});

// --- konva 自体も軽量モックに（react-konva が間接参照するため保険）---
vi.mock("konva", () => {
  return {
    __esModule: true,
    default: {}, // new Konva.XXX を使っていなければ空でOK
    Util: {},
  };
});
