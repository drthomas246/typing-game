import {
  act,
  type RenderHookResult,
  renderHook,
  waitFor,
} from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  Action,
  EngineOptions,
  EngineState,
  LearningPhase,
  QAPair,
  SoundCtl,
} from "@/types/index";

let battleContext = false;
vi.mock("@/contexts/PageContext", () => ({
  useBattle: () => battleContext,
}));

const initOrderMock = vi.fn<() => void>();
vi.mock("@/hooks/typingEngine/useSequence", () => {
  const makeRand = (seedNum: number) => {
    let s = seedNum >>> 0 || 1;
    return () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 0x100000000;
    };
  };
  const seededOrder = (len: number, seed?: number) => {
    const arr = Array.from({ length: len }, (_, i) => i);
    if (seed == null) return arr;
    const rand = makeRand(Number(seed));
    for (let i = len - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  return {
    useSequence: (QA: QAPair[], opts?: EngineOptions) => {
      const orderIdx = seededOrder(QA.length, opts?.seed);
      return {
        order: orderIdx,
        initOrder: initOrderMock,

        getPair: (i: number) => QA[orderIdx[i]],
      };
    },
  };
});

vi.mock("@/hooks/typingEngine/useTimer", () => ({
  useTimer: () => ({ nowMs: 0 }),
}));

vi.mock("@/hooks/useSpeech", () => ({
  useSpeech: () => ({
    speak: vi.fn<(text: string, opts?: { lang?: string }) => void>(),
  }),
}));

const playBgmMock = vi.fn<() => void>();
const stopBgmMock = vi.fn<() => void>();
const sfxMock = {
  slash: vi.fn<() => void>(),
  punch: vi.fn<() => void>(),
  defeat: vi.fn<() => void>(),
  escape: vi.fn<() => void>(),
  fallDown: vi.fn<() => void>(),
  levelUp: vi.fn<() => void>(),
  keyOn: vi.fn<() => void>(),
};
vi.mock("@/hooks/typingEngine/useSound", () => ({
  useSound: (): SoundCtl => ({
    playBgm: playBgmMock,
    stopBgm: stopBgmMock,
    sfx: sfxMock,
  }),
}));

vi.mock("@/hooks/typingEngine/useSpeechOnce", () => ({
  useSpeechOnce: () => undefined,
}));

vi.mock("@/lib/judge", () => ({
  judgeChar: vi.fn<
    (answer: string, cursor: number, key: string) => { ok: boolean }
  >(() => ({ ok: true })),
}));

let capturedDispatch: React.Dispatch<Action> | null = null;
vi.mock("@/hooks/typingEngine/useLearning", () => ({
  useLearning: (args: { dispatch: React.Dispatch<Action> }) => {
    capturedDispatch = args.dispatch;
    return {
      setPhase: (phase: LearningPhase) => {
        capturedDispatch?.({
          type: "SET_PHASE",
          payload: { phase, showHint: phase !== "recall" },
        });
      },
    };
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  battleContext = false;
  capturedDispatch = null;
});

describe("useTypingEngine - 基本挙動", () => {
  it("startで開始し、最初の問題がロードされる", async () => {
    const { useTypingEngine } = await import(
      "@/hooks/typingEngine/useTypingEngine"
    );

    const opts: EngineOptions = { tickMs: 50 };
    const QA: QAPair[] = [
      { ja: "りんご", en: "apple" },
      { ja: "ばなな", en: "banana" },
    ];

    const setNum = vi.fn<(v: React.SetStateAction<number>) => void>();
    const setBool = vi.fn<(v: React.SetStateAction<boolean>) => void>();

    const { result } = renderHook(() =>
      useTypingEngine(opts, QA, setNum, setNum, setNum, setBool),
    );

    act(() => {
      result.current.start();
    });

    await waitFor(() => {
      expect(result.current.state.started).toBe(true);
      expect(result.current.state.index).toBe(0);
      expect(result.current.state.answerEn).toBe("apple");
    });

    expect(initOrderMock).toHaveBeenCalled();

    expect(playBgmMock).toHaveBeenCalled();
  });

  it("learn-then-recall: study→recall でヒント非表示になる", async () => {
    const { useTypingEngine } = await import(
      "@/hooks/typingEngine/useTypingEngine"
    );

    battleContext = true;
    const opts: EngineOptions = { tickMs: 50 };
    const QA: QAPair[] = [
      { ja: "りんご", en: "apple" },
      { ja: "ばなな", en: "banana" },
    ];

    const setNum = vi.fn<(v: React.SetStateAction<number>) => void>();
    const setBool = vi.fn<(v: React.SetStateAction<boolean>) => void>();

    const { result } = renderHook(() =>
      useTypingEngine(opts, QA, setNum, setNum, setNum, setBool),
    );

    act(() => {
      result.current.start();
    });

    await waitFor(() => {
      expect(result.current.state.started).toBe(true);
      expect(result.current.state.index).toBe(0);
      expect(result.current.state.answerEn).toBe("apple");
    });

    expect(result.current.state.showHint).toBe(true);

    act(() => {
      result.current.setLearningPhase("recall");
    });

    await waitFor(() => {
      expect(result.current.state.learningPhase).toBe("recall");
      expect(result.current.state.showHint).toBe(false);
    });
  });

  it("Tabヒント: recall中の2回目Tabで文字ヒントが表示される", async () => {
    const { useTypingEngine } = await import(
      "@/hooks/typingEngine/useTypingEngine"
    );

    battleContext = true;
    const opts: EngineOptions = { tickMs: 50 };
    const QA: QAPair[] = [
      { ja: "りんご", en: "apple" },
      { ja: "ばなな", en: "banana" },
    ];

    const setNum = vi.fn<(v: React.SetStateAction<number>) => void>();
    const setBool = vi.fn<(v: React.SetStateAction<boolean>) => void>();

    const { result } = renderHook(() =>
      useTypingEngine(opts, QA, setNum, setNum, setNum, setBool),
    );

    act(() => {
      result.current.start();
    });
    await waitFor(() => {
      expect(result.current.state.started).toBe(true);
      expect(result.current.state.answerEn).toBe("apple");
    });

    act(() => {
      result.current.setLearningPhase("recall");
    });
    await waitFor(() => {
      expect(result.current.state.learningPhase).toBe("recall");
      expect(result.current.state.showHint).toBe(false);
      expect(result.current.state.hintStep).toBe(0);
    });

    act(() => {
      result.current.onKey?.("\t");
    });
    await waitFor(() => {
      expect(result.current.state.hintStep).toBe(1);
    });

    act(() => {
      result.current.onKey?.("\t");
    });
    await waitFor(() => {
      expect(result.current.state.hintStep).toBe(2);
      expect(result.current.state.showHint).toBe(true);
    });
  });
});

describe("useTypingEngine - バトル仕様（per-test mock with resetModules）", () => {
  it("バトル: ミスで自HP減少、文クリアで敵HP減少", async () => {
    vi.resetModules();

    vi.doMock("@/hooks/typingEngine/useInput", () => ({
      useInput: (args: {
        state: EngineState;
        onMiss: (s: EngineState) => void;
        onSentenceClear: (s: EngineState) => void;
      }) => {
        return {
          onKey: (key: string) => {
            if (key === "MISS") args.onMiss(args.state);
            if (key === "CLEAR") args.onSentenceClear(args.state);
          },
        };
      },
    }));

    vi.doMock("@/hooks/typingEngine/useBattle", () => ({
      useBattle: (
        _opts: EngineOptions,
        _sound: SoundCtl,
        _setHurtId: React.Dispatch<React.SetStateAction<number>>,
        _setSlashId: React.Dispatch<React.SetStateAction<number>>,
        dispatch: React.Dispatch<Action>,
      ) => {
        return {
          onMiss: (_s: EngineState) => {
            dispatch({ type: "DAMAGE_PLAYER", payload: { amount: 10 } });
          },
          onSentenceClear: (_s: EngineState) => {
            dispatch({ type: "DAMAGE_ENEMY", payload: { amount: 20 } });
          },
        };
      },
    }));

    const { useTypingEngine } = await import(
      "@/hooks/typingEngine/useTypingEngine"
    );

    battleContext = true;
    const opts: EngineOptions = {
      tickMs: 50,
      playerMaxHp: 100,
      enemyMaxHp: 100,
    };
    const QA: QAPair[] = [
      { ja: "りんご", en: "apple" },
      { ja: "ばなな", en: "banana" },
    ];

    const setNum = vi.fn<(v: React.SetStateAction<number>) => void>();
    const setBool = vi.fn<(v: React.SetStateAction<boolean>) => void>();

    const { result } = renderHook(() =>
      useTypingEngine(opts, QA, setNum, setNum, setNum, setBool),
    );

    act(() => {
      result.current.start();
    });
    await waitFor(() => {
      expect(result.current.state.started).toBe(true);
      expect(result.current.state.answerEn).toBe("apple");
      expect(result.current.state.playerHp).toBe(100);
      expect(result.current.state.enemyHp).toBe(100);
    });

    act(() => {
      result.current.onKey?.("MISS");
    });
    await waitFor(() => {
      expect(result.current.state.playerHp).toBe(90);
      expect(result.current.state.enemyHp).toBe(100);
    });

    act(() => {
      result.current.onKey?.("CLEAR");
    });
    await waitFor(() => {
      expect(result.current.state.playerHp).toBe(90);
      expect(result.current.state.enemyHp).toBe(80);
    });

    vi.resetModules();
  });
});

describe("useTypingEngine - TALLY_QUESTION（per-test mock with resetModules）", () => {
  it("TALLY_QUESTION: 1問につき一度だけ加算", async () => {
    vi.resetModules();

    vi.doMock("@/hooks/typingEngine/reducer", () => {
      type TestState = {
        started: boolean;
        finished: boolean;
        index: number;
        answerEn: string;
        questionJa: string;
        startAt?: number;

        playerMaxHp: number;
        enemyMaxHp: number;
        playerHp: number;
        enemyHp: number;

        learningPhase: LearningPhase;
        showHint: boolean;
        hintStep: 0 | 1 | 2;
        victory?: boolean;

        tallyCount: number;
      };

      type StartAction = {
        type: "START";
        payload: { now: number; playerMaxHp: number; enemyMaxHp: number };
      };
      type LoadPairAction = {
        type: "LOAD_PAIR";
        payload: { index: number; pair: QAPair; learning: boolean };
      };
      type SetPhaseAction = {
        type: "SET_PHASE";
        payload: { phase: LearningPhase };
      };
      type TallyAction = { type: "TALLY_QUESTION" };
      type StopAction = { type: "STOP"; payload?: { victory?: boolean } };
      type FinishAction = { type: "FINISH"; payload: { victory: boolean } };
      type TestAction =
        | StartAction
        | LoadPairAction
        | SetPhaseAction
        | TallyAction
        | StopAction
        | FinishAction;

      const initialState = (opts: EngineOptions): TestState => ({
        started: false,
        finished: false,
        index: 0,
        answerEn: "",
        questionJa: "",
        startAt: undefined,
        playerMaxHp: Math.max(1, opts.playerMaxHp ?? 100),
        enemyMaxHp: Math.max(1, opts.enemyMaxHp ?? 100),
        playerHp: Math.max(1, opts.playerMaxHp ?? 100),
        enemyHp: Math.max(1, opts.enemyMaxHp ?? 100),
        learningPhase: "study",
        showHint: true,
        hintStep: 0,
        victory: undefined,
        tallyCount: 0,
      });

      const reducer = (state: TestState, action: TestAction): TestState => {
        switch (action.type) {
          case "START": {
            const { now, playerMaxHp, enemyMaxHp } = action.payload;
            return {
              ...state,
              started: true,
              finished: false,
              startAt: now,
              playerMaxHp,
              enemyMaxHp,
              playerHp: playerMaxHp,
              enemyHp: enemyMaxHp,
            };
          }
          case "LOAD_PAIR": {
            const { index, pair, learning } = action.payload;
            return {
              ...state,
              index,
              answerEn: pair?.en ?? "",
              questionJa: pair?.ja ?? "",
              showHint: learning ? true : state.showHint,
            };
          }
          case "SET_PHASE": {
            const { phase } = action.payload;
            return {
              ...state,
              learningPhase: phase,
              showHint: phase !== "recall",
            };
          }
          case "TALLY_QUESTION": {
            return { ...state, tallyCount: state.tallyCount + 1 };
          }
          case "STOP": {
            const { victory } = action.payload ?? {};
            return { ...state, finished: true, victory };
          }
          case "FINISH": {
            const { victory } = action.payload;
            return { ...state, finished: true, victory };
          }
          default:
            return state;
        }
      };

      return { initialState, reducer };
    });

    const { useTypingEngine } = await import(
      "@/hooks/typingEngine/useTypingEngine"
    );

    const opts: EngineOptions = {
      tickMs: 50,
      playerMaxHp: 100,
      enemyMaxHp: 100,
    };
    const QA: QAPair[] = [
      { ja: "りんご", en: "apple" },
      { ja: "ばなな", en: "banana" },
    ];

    const setNum = vi.fn<(v: React.SetStateAction<number>) => void>();
    const setBool = vi.fn<(v: React.SetStateAction<boolean>) => void>();

    const { result } = renderHook(() =>
      useTypingEngine(opts, QA, setNum, setNum, setNum, setBool),
    );

    act(() => {
      result.current.start();
    });
    await waitFor(() => {
      expect(result.current.state.started).toBe(true);
      expect(result.current.state.index).toBe(0);
      expect(result.current.state.answerEn).toBe("apple");
    });

    act(() => {
      result.current.stop("user");
      result.current.stop("user");
    });

    await waitFor(() => {
      const s = result.current.state as unknown as { tallyCount: number };
      expect(s.tallyCount).toBe(1);
    });

    vi.resetModules();
  });
});

describe("useTypingEngine - seed固定: 出題順が再現される", () => {
  it("同じ seed なら出題順（answerEn の列）が一致し、異なる seed なら異なる", async () => {
    const { useTypingEngine } = await import(
      "@/hooks/typingEngine/useTypingEngine"
    );

    type Engine = ReturnType<typeof useTypingEngine>;
    type EngineHook = RenderHookResult<Engine, void>;

    const QA: QAPair[] = [
      { ja: "1", en: "alpha" },
      { ja: "2", en: "bravo" },
      { ja: "3", en: "charlie" },
      { ja: "4", en: "delta" },
      { ja: "5", en: "echo" },
      { ja: "6", en: "foxtrot" },
    ];

    const makeHook = (seed: number): EngineHook => {
      const opts: EngineOptions = {
        tickMs: 10,
        seed,
        playerMaxHp: 100,
        enemyMaxHp: 100,
      };
      const setNum = vi.fn<(v: React.SetStateAction<number>) => void>();
      const setBool = vi.fn<(v: React.SetStateAction<boolean>) => void>();

      return renderHook<Engine, void>(() =>
        useTypingEngine(opts, QA, setNum, setNum, setNum, setBool),
      );
    };

    const collectAnswers = async (hook: EngineHook, n: number) => {
      const seq: string[] = [];

      act(() => {
        hook.result.current.start();
      });
      await waitFor(() => {
        expect(hook.result.current.state.started).toBe(true);
        expect(hook.result.current.state.index).toBe(0);
        expect(hook.result.current.state.answerEn).not.toBe("");
      });
      seq.push(hook.result.current.state.answerEn);

      for (let i = 1; i < n; i++) {
        act(() => {
          hook.result.current.next();
        });
        await waitFor(() => expect(hook.result.current.state.index).toBe(i));
        seq.push(hook.result.current.state.answerEn);
      }
      return seq;
    };

    const h1 = makeHook(12345);
    const seqA = await collectAnswers(h1, QA.length);
    const h2 = makeHook(12345);
    const seqB = await collectAnswers(h2, QA.length);

    expect(seqA).toEqual(seqB);

    const h3 = makeHook(54321);
    const seqC = await collectAnswers(h3, QA.length);
    expect(seqC).not.toEqual(seqA);
  });
});
