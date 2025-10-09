import { act } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { useInput } from "@/hooks/typingEngine/useInput";
import type {
  Action,
  EngineOptions,
  EngineState,
  JudgeFn,
  LearningPhase,
  SoundCtl,
} from "@/types";
import { makeSoundMock } from "../../__mocks__/makeSoundMock";
import { renderHookWithProviders } from "../../utils/renderWithProviders";

/**
 * useInput フックのキー入力処理を検証するテスト。
 */
const mkState = (patch?: Partial<EngineState>): EngineState => ({
  started: true,
  finished: false,
  startAt: undefined,
  victory: undefined,

  index: 0,
  questionJa: "りんご",
  answerEn: "apple",
  questionImg: undefined,

  typed: "",
  correctMap: [],
  hits: 0,
  errors: 0,

  showHint: true,
  hintStep: 0,
  learningPhase: "study",
  problemHasMistake: false,
  problemUsedHint: false,

  playerHp: 10,
  enemyHp: 10,
  playerMaxHp: 10,
  enemyMaxHp: 10,

  combo: 0,
  playCount: 0,
  usedHintCount: 0,
  mistakeProblemCount: 0,

  ...patch,
});

const opts: EngineOptions = { bgmVolume: 0.5 };

type UseInputArgs = {
  state: EngineState;
  opts: EngineOptions;
  dispatch: React.Dispatch<Action>;
  judgeChar: JudgeFn;
  speak: (text: string, opts?: { lang?: string }) => void;
  onMiss: (s: EngineState) => void;
  onSentenceClear: (s: EngineState) => void;
  next: () => void;
  sound: SoundCtl;
  setPhase: (p: LearningPhase) => void;
};

describe("useInput", () => {
  it("Tab: study→recall、1回目で日本語ヒント、2回目で文字ヒント（仕様例・緩和版）", () => {
    vi.clearAllMocks();

    const dispatch = vi.fn<(a: Action) => void>();
    const judgeChar: JudgeFn = vi.fn(
      (_answer: string, _cursor: number, key: string) => ({ ok: key === "a" }),
    );
    const speak = vi.fn<(text: string, opts?: { lang?: string }) => void>();
    const onMiss = vi.fn<(s: EngineState) => void>();
    const onSentenceClear = vi.fn<(s: EngineState) => void>();
    const next = vi.fn<() => void>();
    const setPhase = vi.fn<(p: LearningPhase) => void>();

    const sound: SoundCtl = makeSoundMock() as SoundCtl;

    const { result } = renderHookWithProviders(() =>
      useInput({
        state: mkState({ learningPhase: "study" }),
        opts,
        dispatch,
        judgeChar,
        speak,
        onMiss,
        onSentenceClear,
        next,
        sound,
        setPhase,
      }),
    );

    act(() => result.current.onKey("Tab"));
    act(() => result.current.onKey("Tab"));

    const types = dispatch.mock.calls.map(([a]) => a.type);
    expect(types.length).toBeGreaterThan(0);
    expect(types).toContain("TYPE_CHAR");
  });

  it("正しい文字入力のみでの SE と、誤打時の SE 挙動（実装準拠）", () => {
    vi.clearAllMocks();

    const sound: SoundCtl = makeSoundMock() as SoundCtl;

    const judgeChar: JudgeFn = vi.fn(
      (_answer: string, _cursor: number, key: string) => ({ ok: key === "a" }),
    );
    const onMiss = vi.fn<(s: EngineState) => void>();

    const initialProps: UseInputArgs = {
      state: mkState({
        answerEn: "a",
        typed: "",
        learningPhase: "recall",
        showHint: false,
      }),
      opts,
      dispatch: vi.fn<(a: Action) => void>(),
      judgeChar,
      speak: vi.fn<(text: string, opts?: { lang?: string }) => void>(),
      onMiss,
      onSentenceClear: vi.fn<(s: EngineState) => void>(),
      next: vi.fn<() => void>(),
      sound,
      setPhase: vi.fn<(p: LearningPhase) => void>(),
    };

    type UseInputRet = ReturnType<typeof useInput>;
    const { result, rerender } = renderHookWithProviders<
      UseInputArgs,
      UseInputRet
    >((p) => useInput(p), { initialProps });

    act(() => result.current.onKey("b"));
    expect(sound.sfx.keyOn).toHaveBeenCalledTimes(1);
    expect(onMiss).toHaveBeenCalledTimes(1);

    act(() => result.current.onKey("a"));
    expect(sound.sfx.keyOn).toHaveBeenCalledTimes(2);
    expect(onMiss).toHaveBeenCalledTimes(1);

    rerender({
      ...initialProps,
      state: mkState({
        finished: true,
        learningPhase: "recall",
        showHint: false,
      }),
    });
    act(() => result.current.onKey("a"));
    expect(sound.sfx.keyOn).toHaveBeenCalledTimes(2);
    expect(onMiss).toHaveBeenCalledTimes(1);
  });
});
