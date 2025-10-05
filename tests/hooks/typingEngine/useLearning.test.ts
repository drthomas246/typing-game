import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import type {
  Action,
  EngineOptions,
  EngineState,
  LearningPhase,
} from "@/types/index";

let battleContext = false;
vi.mock("@/contexts/PageContext", () => ({
  useBattle: () => battleContext,
}));

import { useLearning } from "@/hooks/typingEngine/useLearning";

const baseState = (patch?: Partial<EngineState>): EngineState => ({
  started: true,
  finished: false,
  startAt: undefined,
  victory: undefined,

  index: 0,
  questionJa: "",
  answerEn: "",
  questionImg: undefined,

  typed: "",
  correctMap: [],
  hits: 0,
  errors: 0,

  showHint: false,
  hintStep: 0,
  learningPhase: "study",
  problemHasMistake: false,
  problemUsedHint: false,

  playerHp: 100,
  enemyHp: 100,
  playerMaxHp: 100,
  enemyMaxHp: 100,

  combo: 0,
  playCount: 0,
  usedHintCount: 0,
  mistakeProblemCount: 0,

  ...patch,
});

describe("useLearning", () => {
  let dispatch: Mock<(a: Action) => void>;

  beforeEach(() => {
    dispatch = vi.fn<(a: Action) => void>();
    battleContext = false;
  });

  it("setPhase: battle=false のときは常に showHint=false", () => {
    const state = baseState({ started: true, finished: false });
    const opts: EngineOptions = { learnThenRecall: false };

    const { result } = renderHook(() => useLearning({ state, dispatch, opts }));

    dispatch.mockClear();
    act(() => {
      result.current.setPhase("study");
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PHASE",
      payload: { phase: "study" as LearningPhase, showHint: false },
    });

    dispatch.mockClear();
    act(() => {
      result.current.setPhase("recall");
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PHASE",
      payload: { phase: "recall" as LearningPhase, showHint: false },
    });
  });

  it("setPhase: battle=true かつ learnThenRecall=false → 常に showHint=true", () => {
    battleContext = true;
    const state = baseState({ started: true, finished: false });
    const opts: EngineOptions = { learnThenRecall: false };

    const { result } = renderHook(() => useLearning({ state, dispatch, opts }));

    dispatch.mockClear();
    act(() => {
      result.current.setPhase("study");
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PHASE",
      payload: { phase: "study" as LearningPhase, showHint: true },
    });

    dispatch.mockClear();
    act(() => {
      result.current.setPhase("recall");
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PHASE",
      payload: { phase: "recall" as LearningPhase, showHint: true },
    });
  });

  it("setPhase: battle=true かつ learnThenRecall=true → study で true / recall で false", () => {
    battleContext = true;
    const state = baseState({ started: true, finished: false });
    const opts: EngineOptions = { learnThenRecall: true };

    const { result } = renderHook(() => useLearning({ state, dispatch, opts }));

    dispatch.mockClear();
    act(() => {
      result.current.setPhase("study");
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PHASE",
      payload: { phase: "study" as LearningPhase, showHint: true },
    });

    dispatch.mockClear();
    act(() => {
      result.current.setPhase("recall");
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_PHASE",
      payload: { phase: "recall" as LearningPhase, showHint: false },
    });
  });

  it("初回マウント時: started=true & finished=false のとき SYNC_LEARNING_TOGGLE を dispatch", () => {
    battleContext = true;
    const state = baseState({ started: true, finished: false });
    const opts: EngineOptions = { learnThenRecall: true };

    renderHook(() => useLearning({ state, dispatch, opts }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "SYNC_LEARNING_TOGGLE",
      payload: { learning: true, learnThenRecall: true },
    });
  });

  it("started=false または finished=true の場合は SYNC を dispatch しない", () => {
    {
      const state = baseState({ started: false, finished: false });
      const opts: EngineOptions = { learnThenRecall: false };
      renderHook(() => useLearning({ state, dispatch, opts }));
      expect(dispatch).not.toHaveBeenCalled();
    }

    dispatch.mockClear();

    {
      const state = baseState({ started: true, finished: true });
      const opts: EngineOptions = { learnThenRecall: false };
      renderHook(() => useLearning({ state, dispatch, opts }));
      expect(dispatch).not.toHaveBeenCalled();
    }
  });

  it("依存が変わるたび（battle / opts.learnThenRecall）に SYNC を再 dispatch", () => {
    const state = baseState({ started: true, finished: false });
    battleContext = false;

    const { rerender } = renderHook(
      (p: { learnThenRecall: boolean }) =>
        useLearning({
          state,
          dispatch,
          opts: { learnThenRecall: p.learnThenRecall } as EngineOptions,
        }),
      { initialProps: { learnThenRecall: false } },
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: "SYNC_LEARNING_TOGGLE",
      payload: { learning: false, learnThenRecall: false },
    });

    dispatch.mockClear();

    rerender({ learnThenRecall: true });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SYNC_LEARNING_TOGGLE",
      payload: { learning: false, learnThenRecall: true },
    });

    dispatch.mockClear();

    battleContext = true;
    rerender({ learnThenRecall: true });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SYNC_LEARNING_TOGGLE",
      payload: { learning: true, learnThenRecall: true },
    });
  });
});
