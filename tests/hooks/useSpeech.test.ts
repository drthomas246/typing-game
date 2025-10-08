import { act, renderHook } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/**
 * useSpeech フックの音声読み上げ挙動を検証するテスト。
 */
const h = vi.hoisted(() => {
  class MockUtterance {
    text: string;
    lang = "en-US";
    rate = 1;
    pitch = 1;
    volume = 1;
    voice: SpeechSynthesisVoice | null = null;
    onend: ((this: SpeechSynthesisUtterance, ev: Event) => void) | null = null;
    onerror: ((this: SpeechSynthesisUtterance, ev: Event) => void) | null =
      null;

    constructor(text: string) {
      this.text = text;
      MockUtterance.instances.push(this);
    }
    static instances: MockUtterance[] = [];
    static reset(): void {
      MockUtterance.instances.length = 0;
    }
  }

  const mkVoice = (lang: string, name = lang): SpeechSynthesisVoice =>
    ({
      default: false,
      lang,
      localService: true,
      name,
      voiceURI: name,
    }) as SpeechSynthesisVoice;

  let _voices: SpeechSynthesisVoice[] = [];
  const setVoices = (v: SpeechSynthesisVoice[]): void => {
    _voices = v;
  };

  const speak = vi.fn<(utterance: unknown) => void>();
  const cancel = vi.fn<() => void>();
  const resume = vi.fn<() => void>();

  let _onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => void) | null =
    null;

  const ssObj = {
    speak: (utt: unknown) => speak(utt),
    cancel: () => cancel(),
    resume: () => resume(),
    pause: () => {},
    paused: false,
    pending: false,
    speaking: false,
    getVoices: () => _voices,
    get onvoiceschanged() {
      return _onvoiceschanged;
    },
    set onvoiceschanged(
      fn: ((this: SpeechSynthesis, ev: Event) => void) | null,
    ) {
      _onvoiceschanged = fn;
    },
  };

  const ss = ssObj as unknown as SpeechSynthesis;

  const triggerVoicesChanged = (): void => {
    if (_onvoiceschanged) {
      _onvoiceschanged.call(ss, new Event("voiceschanged"));
    }
  };

  const reset = (): void => {
    MockUtterance.reset();
    setVoices([]);
    speak.mockClear();
    cancel.mockClear();
    resume.mockClear();

    // @ts-expect-error: テスト用に writable 扱い
    ss.paused = false;
  };

  return {
    MockUtterance,
    mkVoice,
    setVoices,
    triggerVoicesChanged,
    ss,
    speak,
    cancel,
    resume,
    reset,
  };
});

let restoreGlobals: (() => void) | null = null;
beforeAll(() => {
  vi.useFakeTimers();

  const g = globalThis as Record<string, unknown>;

  try {
    vi.stubGlobal("speechSynthesis", h.ss);
    vi.stubGlobal("SpeechSynthesisUtterance", h.MockUtterance);
    restoreGlobals = () => vi.unstubAllGlobals();
  } catch {
    const origSS = (g as { speechSynthesis?: unknown }).speechSynthesis;
    const origUtt = (g as { SpeechSynthesisUtterance?: unknown })
      .SpeechSynthesisUtterance;

    try {
      (g as { speechSynthesis: unknown }).speechSynthesis = h.ss;
      (g as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
        h.MockUtterance;
    } catch {
      try {
        Object.defineProperty(globalThis, "speechSynthesis", {
          value: h.ss,
          configurable: true,
          writable: true,
        });
        Object.defineProperty(globalThis, "SpeechSynthesisUtterance", {
          value: h.MockUtterance,
          configurable: true,
          writable: true,
        });
      } catch {}
    }

    restoreGlobals = () => {
      (g as { speechSynthesis?: unknown }).speechSynthesis = origSS;
      (g as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance =
        origUtt;
    };
  }
});

afterAll(() => {
  vi.useRealTimers();
  if (restoreGlobals) restoreGlobals();
});

afterEach(() => {
  vi.clearAllTimers();
});

import { useSpeech } from "@/hooks/useSpeech";

describe("useSpeech", () => {
  beforeEach(() => {
    h.reset();
  });

  it("初期ロード: voices が空 → onvoiceschanged で voices 反映＆isReady=true", async () => {
    const { result } = renderHook(() => useSpeech());

    expect(result.current.isReady).toBe(false);
    expect(result.current.voices.length).toBe(0);

    await act(async () => {
      const prom = result.current.waitUntilReady();

      setTimeout(() => {
        h.setVoices([h.mkVoice("en-US"), h.mkVoice("en-GB")]);
        h.triggerVoicesChanged();
      }, 100);

      vi.advanceTimersByTime(150);
      await prom;
    });

    expect(result.current.isReady).toBe(true);
    expect(result.current.voices.map((v) => v.lang)).toEqual([
      "en-US",
      "en-GB",
    ]);
  });

  it("warmup: ready 後に cancel→無音 '.' を speak", async () => {
    h.setVoices([h.mkVoice("en-US")]);
    const { result } = renderHook(() => useSpeech());

    await act(async () => {
      await result.current.warmup();
    });

    expect(h.cancel).toHaveBeenCalledTimes(1);

    const last = h.MockUtterance.instances.at(-1);
    expect(last?.text).toBe(".");
    expect(last?.lang).toBe("en-US");
    expect(last?.volume).toBe(0);
    expect(h.speak).toHaveBeenCalledTimes(1);

    expect(h.speak).toHaveBeenCalledWith(last);
  });

  it("stop: currentUtter を解放し cancel を呼ぶ（例外なく安全に）", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => {
      result.current.stop();
    });
    expect(h.cancel).toHaveBeenCalledTimes(1);
  });

  it("speak: 重複抑止（dedupeMs 内の同一テキストは 2 度目以降無視）", () => {
    h.setVoices([h.mkVoice("en-US")]);
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak("hello");
      vi.runAllTimers();
    });
    expect(h.speak).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.speak("hello");
      vi.advanceTimersByTime(100);
      vi.runAllTimers();
    });
    expect(h.speak).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(600);
      result.current.speak("hello");
      vi.runAllTimers();
    });
    expect(h.speak).toHaveBeenCalledTimes(2);
  });

  it("speak: 指定 lang に最優先一致 → startsWith 一致 → voiceHint 一致の順で選択", () => {
    h.setVoices([
      h.mkVoice("ja-JP", "ja"),
      h.mkVoice("en-GB", "en-GB"),
      h.mkVoice("en-US", "en-US"),
      h.mkVoice("en", "generic-en"),
    ]);
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak("one", { lang: "en-GB" });
      vi.runAllTimers();
    });
    let u = h.MockUtterance.instances.at(-1);
    expect(u?.voice?.lang).toBe("en-GB");

    act(() => {
      result.current.speak("two", { lang: "en-AU" });
      vi.runAllTimers();
    });
    u = h.MockUtterance.instances.at(-1);
    expect(["en-GB", "en-US"]).toContain(u?.voice?.lang);

    act(() => {
      result.current.speak("three", { lang: "xx-YY", voiceHint: "ja" });
      vi.runAllTimers();
    });
    u = h.MockUtterance.instances.at(-1);
    expect(u?.voice?.lang).toBe("ja-JP");
  });

  it("speak: speechSynthesis.paused=true のとき resume() が呼ばれる", () => {
    // @ts-expect-error: テスト用に writable 扱い
    h.ss.paused = true;
    h.setVoices([h.mkVoice("en-US")]);
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak("resume please");
      vi.runAllTimers();
    });

    expect(h.resume).toHaveBeenCalledTimes(1);
    expect(h.speak).toHaveBeenCalledTimes(1);
  });

  it("speak: ready でない場合は 60ms 遅延後に speak される", () => {
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak("later");

      expect(h.speak).toHaveBeenCalledTimes(0);
      vi.advanceTimersByTime(59);
      expect(h.speak).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(1);
    });
    expect(h.speak).toHaveBeenCalledTimes(1);
  });

  it("speak: onend/onerror で現在の Utterance を解放（エラーなく完走すること）", () => {
    h.setVoices([h.mkVoice("en-US")]);
    const { result } = renderHook(() => useSpeech());

    act(() => {
      result.current.speak("goodbye");
      vi.runAllTimers();
    });

    expect(h.cancel).toHaveBeenCalledTimes(1);

    const last = h.MockUtterance.instances.at(-1);

    act(() => {
      const handler = last?.onend as unknown as
        | ((this: unknown, ev: Event) => void)
        | null;
      handler?.call(last, new Event("end"));
    });
    expect(h.cancel).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stop();
    });
    expect(h.cancel).toHaveBeenCalledTimes(2);
  });
});
