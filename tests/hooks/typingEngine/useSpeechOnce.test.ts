import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeechOnce } from "@/hooks/typingEngine/useSpeechOnce";
import type { EngineOptions, EngineState } from "@/types/index";

/**
 * useSpeechOnce フックの読み上げ条件を検証するテスト。
 */
let battleFlag = true;
vi.mock("@/contexts/PageContext", () => ({
  useBattle: () => battleFlag,
}));

const speak = vi.fn<(text: string, opts?: { lang?: string } | string) => void>(
  () => {},
);
vi.mock("@/hooks/useSpeech", () => ({
  useSpeech: () => ({ speak }),
}));

const baseState = (patch?: Partial<EngineState>): EngineState => ({
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

  showHint: false,
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

const opts: EngineOptions = {};

beforeEach(() => {
  vi.clearAllMocks();
  battleFlag = true;
});

describe("useSpeechOnce", () => {
  it("条件を満たすと一度だけ speak が呼ばれる（同一キーでは再実行しない）", () => {
    const { rerender } = renderHook(
      ({ state, lang }: { state: EngineState; lang?: string }) =>
        useSpeechOnce({ state, opts, lang }),
      { initialProps: { state: baseState(), lang: undefined } },
    );

    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenLastCalledWith("apple", { lang: "en-US" });

    rerender({ state: baseState(), lang: undefined });
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it("index が変わると再度 speak される", () => {
    const { rerender } = renderHook(
      ({ state }: { state: EngineState }) => useSpeechOnce({ state, opts }),
      { initialProps: { state: baseState({ index: 0 }) } },
    );
    expect(speak).toHaveBeenCalledTimes(1);

    rerender({ state: baseState({ index: 1 }) });
    expect(speak).toHaveBeenCalledTimes(2);
  });

  it("answerEn が変わると再度 speak される", () => {
    const { rerender } = renderHook(
      ({ state }: { state: EngineState }) => useSpeechOnce({ state, opts }),
      { initialProps: { state: baseState({ answerEn: "apple" }) } },
    );
    expect(speak).toHaveBeenCalledTimes(1);

    rerender({ state: baseState({ answerEn: "banana" }) });
    expect(speak).toHaveBeenCalledTimes(2);
    expect(speak).toHaveBeenLastCalledWith("banana", { lang: "en-US" });
  });

  it("lang を指定するとその言語コードで speak される", () => {
    renderHook(
      ({ state, lang }: { state: EngineState; lang?: string }) =>
        useSpeechOnce({ state, opts, lang }),
      { initialProps: { state: baseState(), lang: "en-GB" } },
    );
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenLastCalledWith("apple", { lang: "en-GB" });
  });

  it("battle=false のときは speak されない", () => {
    battleFlag = false;
    renderHook(() => useSpeechOnce({ state: baseState(), opts }));
    expect(speak).not.toHaveBeenCalled();
  });

  it("未開始(started=false) は speak されない", () => {
    renderHook(() =>
      useSpeechOnce({ state: baseState({ started: false }), opts }),
    );
    expect(speak).not.toHaveBeenCalled();
  });

  it("finished=true は speak されない", () => {
    renderHook(() =>
      useSpeechOnce({ state: baseState({ finished: true }), opts }),
    );
    expect(speak).not.toHaveBeenCalled();
  });

  it('learningPhase !== "study" は speak されない', () => {
    renderHook(() =>
      useSpeechOnce({
        state: baseState({ learningPhase: "recall" }),
        opts,
      }),
    );
    expect(speak).not.toHaveBeenCalled();
  });

  it("answerEn が空なら speak されない", () => {
    renderHook(() =>
      useSpeechOnce({ state: baseState({ answerEn: "" }), opts }),
    );
    expect(speak).not.toHaveBeenCalled();
  });

  it("try/catch の互換呼び出し分岐も通過する（speak が例外を投げるケース）", () => {
    const err = new Error("speak failed");
    speak.mockImplementationOnce(() => {
      throw err;
    });

    renderHook(() => useSpeechOnce({ state: baseState(), opts }));

    expect(speak).toHaveBeenCalledTimes(2);
  });
});
