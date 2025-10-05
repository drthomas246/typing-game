import { useCallback } from "react";
import { useBattle } from "@/contexts/PageContext";
import type {
  Action,
  EngineOptions,
  EngineState,
  JudgeFn,
  LearningPhase,
  SoundCtl,
} from "@/types/index";

export function useInput(params: {
  state: EngineState;
  opts: EngineOptions;
  dispatch: React.Dispatch<Action>;
  judgeChar: JudgeFn;
  sound: SoundCtl;
  speak: (text: string, opts?: { lang?: string }) => void;
  onMiss: (s: EngineState) => void;
  onSentenceClear: (s: EngineState) => void;
  next: () => void;
  setPhase: (phase: LearningPhase) => void;
}) {
  const battle = useBattle();
  const {
    state,
    opts,
    dispatch,
    judgeChar,
    speak,
    onMiss,
    onSentenceClear,
    next,
    sound,
    setPhase,
  } = params;

  const onKey = useCallback(
    (key: string) => {
      if (!state.started || state.finished || state.answerEn.length === 0)
        return;

      if (key === " ") {
        dispatch({ type: "TALLY_QUESTION" });
        next();
        return;
      }

      if (key === "\t") {
        const inRecall = state.learningPhase === "recall";
        if (!battle || inRecall) {
          if (state.hintStep === 0) {
            // 1回目: 音声 + step=1
            try {
              speak(state.answerEn, { lang: "en-US" });
            } catch {
              speak(state.answerEn, { lang: "en-US" });
            }
            dispatch({
              type: "SET_HINT_STEP",
              payload: { step: 1, markUsedHint: true },
            });
            if (!battle) onMiss(state);
          } else if (state.hintStep === 1) {
            dispatch({
              type: "SET_HINT_STEP",
              payload: { step: 2, showHint: true, markUsedHint: true },
            });
            if (!battle) onMiss(state);
          }
        }
        return;
      }

      if (key === "\b") {
        if (state.typed.length > 0) dispatch({ type: "BACKSPACE" });
        return;
      }

      if (key === "\n") return;

      if (state.typed.length >= state.answerEn.length) return;

      const cursor = state.typed.length;
      const res = judgeChar(state.answerEn, cursor, key);
      dispatch({ type: "TYPE_CHAR", payload: { key, ok: res.ok } });

      if (!res.ok) {
        onMiss(state);
      }
      sound.sfx.keyOn();
      const willCompleteLen = cursor + 1 === state.answerEn.length;
      const allPrevCorrect = state.correctMap.every(Boolean);
      const completesAllCorrect = willCompleteLen && res.ok && allPrevCorrect;

      if (!completesAllCorrect) return;

      if (battle && opts.learnThenRecall && state.learningPhase === "study") {
        setPhase("recall");
        return;
      }

      onSentenceClear(state);

      dispatch({ type: "TALLY_QUESTION" });
      next();
    },
    [
      sound,
      state,
      battle,
      opts.learnThenRecall,
      dispatch,
      judgeChar,
      speak,
      onMiss,
      onSentenceClear,
      next,
      setPhase,
    ],
  );

  return { onKey };
}
