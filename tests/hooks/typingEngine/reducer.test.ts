import { describe, expect, it } from "vitest";
import { initialState, reducer } from "@/hooks/typingEngine/reducer";
import type { EngineOptions, QAPair } from "@/types/index";

type ReducerAction = Parameters<typeof reducer>[1];

type StartPayload = Extract<ReducerAction, { type: "START" }>["payload"];
type LoadPairPayload = Extract<ReducerAction, { type: "LOAD_PAIR" }>["payload"];
type TypeCharPayload = Extract<ReducerAction, { type: "TYPE_CHAR" }>["payload"];
type SetPhasePayload = Extract<ReducerAction, { type: "SET_PHASE" }>["payload"];
type SetHintStepPayload = Extract<
  ReducerAction,
  { type: "SET_HINT_STEP" }
>["payload"];
type SyncLearningTogglePayload = Extract<
  ReducerAction,
  { type: "SYNC_LEARNING_TOGGLE" }
>["payload"];
type DamagePlayerPayload = Extract<
  ReducerAction,
  { type: "DAMAGE_PLAYER" }
>["payload"];
type DamageEnemyPayload = Extract<
  ReducerAction,
  { type: "DAMAGE_ENEMY" }
>["payload"];
type StopPayload = Extract<ReducerAction, { type: "STOP" }>["payload"];
type FinishPayload = Extract<ReducerAction, { type: "FINISH" }>["payload"];

const start = (patch?: Partial<StartPayload>): ReducerAction => ({
  type: "START",
  payload: {
    now: Date.now(),
    playerMaxHp: 10,
    enemyMaxHp: 8,
    learning: true,
    playCount: 0,
    ...patch,
  },
});

const loadPair = (index: number, learning = true): ReducerAction => {
  const pair: QAPair = { ja: "りんご", en: "apple", img: undefined };
  const payload: LoadPairPayload = { index, pair, learning };
  return { type: "LOAD_PAIR", payload };
};

describe("hooks/typingEngine/reducer", () => {
  it("START: learning フラグに応じた初期化（study/recall, showHint, HP 反映）", () => {
    const opts1: EngineOptions = {
      playerMaxHp: 1,
      enemyMaxHp: 1,
      learningMode: false,
    };
    let s = reducer(
      initialState(opts1),
      start({
        playerMaxHp: 12,
        enemyMaxHp: 7,
        learning: true,
        playCount: 2,
      }),
    );
    expect(s.started).toBe(true);
    expect(s.finished).toBe(false);
    expect(s.playCount).toBe(2);
    expect(s.playerMaxHp).toBe(12);
    expect(s.enemyMaxHp).toBe(7);
    expect(s.learningPhase).toBe("study");
    expect(s.showHint).toBe(true);
    expect(s.hintStep).toBe(0);

    s = reducer(s, start({ learning: false }));
    expect(s.learningPhase).toBe("recall");
    expect(s.showHint).toBe(false);
  });

  it("LOAD_PAIR: ペア/インデックス読み込み、ヒント/学習フラグがリセットされる", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, loadPair(0, true));
    expect(s.index).toBe(0);
    expect(s.questionJa).toBe("りんご");
    expect(s.answerEn).toBe("apple");
    expect(s.typed).toBe("");
    expect(s.correctMap.length).toBe(0);
    expect(s.showHint).toBe(true);
    expect(s.problemHasMistake).toBe(false);
    expect(s.problemUsedHint).toBe(true);
    expect(s.hintStep).toBe(0);
    expect(s.learningPhase).toBe("study");
  });

  it("TYPE_CHAR: ok/NG で hits/errors/problemHasMistake が更新される", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, loadPair(0, true));

    const a1: ReducerAction = {
      type: "TYPE_CHAR",
      payload: { key: "a", ok: true } satisfies TypeCharPayload,
    };
    s = reducer(s, a1);
    expect(s.typed).toBe("a");
    expect(s.correctMap).toEqual([true]);
    expect(s.hits).toBe(1);
    expect(s.errors).toBe(0);
    expect(s.problemHasMistake).toBe(false);

    const a2: ReducerAction = {
      type: "TYPE_CHAR",
      payload: { key: "x", ok: false } satisfies TypeCharPayload,
    };
    s = reducer(s, a2);
    expect(s.typed).toBe("ax");
    expect(s.correctMap).toEqual([true, false]);
    expect(s.hits).toBe(1);
    expect(s.errors).toBe(1);
    expect(s.problemHasMistake).toBe(true);
  });

  it("BACKSPACE: 文字・正誤履歴を1つ戻す（空なら無視）", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, loadPair(0, true));

    const s0 = s;
    s = reducer(s, { type: "BACKSPACE" } satisfies ReducerAction);
    expect(s).toEqual(s0);

    s = reducer(s, {
      type: "TYPE_CHAR",
      payload: { key: "a", ok: true } satisfies TypeCharPayload,
    } satisfies ReducerAction);
    s = reducer(s, {
      type: "TYPE_CHAR",
      payload: { key: "x", ok: false } satisfies TypeCharPayload,
    } satisfies ReducerAction);
    s = reducer(s, { type: "BACKSPACE" } satisfies ReducerAction);
    expect(s.typed).toBe("a");
    expect(s.correctMap).toEqual([true]);
  });

  it("SET_PHASE: phase と showHint の自動/明示設定、入力/ヒントのリセット", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, loadPair(0, true));

    s = reducer(s, {
      type: "SET_PHASE",
      payload: { phase: "recall", showHint: false } satisfies SetPhasePayload,
    } satisfies ReducerAction);
    expect(s.learningPhase).toBe("recall");
    expect(s.showHint).toBe(false);
    expect(s.typed).toBe("");
    expect(s.correctMap).toEqual([]);
    expect(s.hintStep).toBe(0);

    s = reducer(s, {
      type: "SET_PHASE",
      payload: { phase: "recall", showHint: true } satisfies SetPhasePayload,
    } satisfies ReducerAction);
    expect(s.showHint).toBe(true);
  });

  it("SET_HINT_STEP / MARK_USED_HINT: ヒント段階/使用フラグの更新", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, loadPair(0, true));

    s = reducer(s, {
      type: "SET_HINT_STEP",
      payload: {
        step: 1,
        showHint: true,
        markUsedHint: true,
      } satisfies SetHintStepPayload,
    } satisfies ReducerAction);
    expect(s.hintStep).toBe(1);
    expect(s.showHint).toBe(true);
    expect(s.problemUsedHint).toBe(true);

    s = reducer(s, { type: "MARK_USED_HINT" } satisfies ReducerAction);
    expect(s.problemUsedHint).toBe(true);
  });

  it("SYNC_LEARNING_TOGGLE: learnThenRecall/phase/hintStep に応じて showHint/usedHint を同期", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start({ learning: true }));
    s = reducer(s, loadPair(0, true));

    s = reducer(s, {
      type: "SET_HINT_STEP",
      payload: { step: 2 } satisfies SetHintStepPayload,
    } satisfies ReducerAction);

    s = reducer(s, {
      type: "SYNC_LEARNING_TOGGLE",
      payload: {
        learning: true,
        learnThenRecall: true,
      } satisfies SyncLearningTogglePayload,
    } satisfies ReducerAction);

    expect(s.hintStep).toBe(2);
    expect(s.showHint).toBe(true);
    expect(s.problemUsedHint).toBe(true);
  });

  it("TALLY_QUESTION: ヒント使用/ミス有りで disqualified→combo=0、カウンタ加算。正答のみなら combo++", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 8,
      learningMode: true,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, loadPair(0, true));

    s = reducer(s, {
      type: "SET_HINT_STEP",
      payload: { step: 1, markUsedHint: true } satisfies SetHintStepPayload,
    } satisfies ReducerAction);
    s = reducer(s, {
      type: "TYPE_CHAR",
      payload: { key: "x", ok: false } satisfies TypeCharPayload,
    } satisfies ReducerAction);
    const before = { used: s.usedHintCount, mist: s.mistakeProblemCount };
    s = reducer(s, { type: "TALLY_QUESTION" } satisfies ReducerAction);
    expect(s.usedHintCount).toBe(before.used + 1);
    expect(s.mistakeProblemCount).toBe(before.mist + 1);
    expect(s.combo).toBe(0);

    s = reducer(s, {
      type: "LOAD_PAIR",
      payload: {
        index: 1,
        pair: { ja: "ばなな", en: "banana" },
        learning: false,
      } satisfies LoadPairPayload,
    } satisfies ReducerAction);
    s = reducer(s, {
      type: "TYPE_CHAR",
      payload: { key: "a", ok: true } satisfies TypeCharPayload,
    } satisfies ReducerAction);
    s = reducer(s, { type: "TALLY_QUESTION" } satisfies ReducerAction);
    expect(s.combo).toBe(1);
  });

  it("DAMAGE_PLAYER / DAMAGE_ENEMY: HP 減少と終了判定・勝敗の更新", () => {
    const optsWin: EngineOptions = {
      playerMaxHp: 5,
      enemyMaxHp: 3,
      learningMode: false,
    };
    let s = reducer(
      initialState(optsWin),
      start({ playerMaxHp: 5, enemyMaxHp: 3, learning: false }),
    );

    s = reducer(s, {
      type: "DAMAGE_ENEMY",
      payload: { amount: 2 } satisfies DamageEnemyPayload,
    } satisfies ReducerAction);
    expect(s.enemyHp).toBe(1);
    expect(s.finished).toBe(false);

    s = reducer(s, {
      type: "DAMAGE_ENEMY",
      payload: { amount: 1 } satisfies DamageEnemyPayload,
    } satisfies ReducerAction);
    expect(s.enemyHp).toBe(0);
    expect(s.finished).toBe(true);
    expect(s.victory).toBe(true);

    const optsLose: EngineOptions = {
      playerMaxHp: 3,
      enemyMaxHp: 3,
      learningMode: false,
    };
    s = reducer(
      initialState(optsLose),
      start({ playerMaxHp: 3, enemyMaxHp: 3, learning: false }),
    );
    s = reducer(s, {
      type: "DAMAGE_PLAYER",
      payload: { amount: 3 } satisfies DamagePlayerPayload,
    } satisfies ReducerAction);
    expect(s.playerHp).toBe(0);
    expect(s.finished).toBe(true);
    expect(s.victory).toBe(false);
  });

  it("STOP / FINISH: finished/victory を設定。STOP は二重終了を防ぐ", () => {
    const opts: EngineOptions = {
      playerMaxHp: 3,
      enemyMaxHp: 3,
      learningMode: false,
    };
    let s = reducer(initialState(opts), start());
    s = reducer(s, {
      type: "STOP",
      payload: { victory: false } satisfies StopPayload,
    } satisfies ReducerAction);
    expect(s.finished).toBe(true);
    expect(s.victory).toBe(false);

    const s0 = s;
    s = reducer(s, {
      type: "STOP",
      payload: { victory: true } satisfies StopPayload,
    } satisfies ReducerAction);
    expect(s).toEqual(s0);

    s = reducer(s, {
      type: "FINISH",
      payload: { victory: true } satisfies FinishPayload,
    } satisfies ReducerAction);
    expect(s.victory).toBe(true);
  });

  it("default: 未知 Action はそのまま返す", () => {
    const opts: EngineOptions = {
      playerMaxHp: 10,
      enemyMaxHp: 10,
      learningMode: false,
    };
    const s = initialState(opts);
    // @ts-expect-error — 意図的：存在しない type を渡して default 分岐をテスト
    const s2 = reducer(s, { type: "UNKNOWN" });
    expect(s2).toEqual(s);
  });
});
