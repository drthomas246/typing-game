import type {
  Action,
  EngineOptions,
  EngineState,
  LearningPhase,
} from "@/types/index";
import { useCallback, useEffect } from "react";

export function useLearning(params: {
  state: EngineState;
  dispatch: React.Dispatch<Action>;
  opts: EngineOptions;
}) {
  const { state, dispatch, opts } = params;

  const setPhase = useCallback(
    (phase: LearningPhase) => {
      
      const learning = !!opts.learningMode;
      const learnThenRecall = !!opts.learnThenRecall;

      
      const baseShow = learning ? !learnThenRecall || phase === "study" : false;

      dispatch({
        type: "SET_PHASE",
        payload: {
          phase,
          showHint: baseShow,
        },
      });
    },
    [dispatch, opts.learningMode, opts.learnThenRecall]
  );

  
  useEffect(() => {
    if (!state.started || state.finished) return;
    dispatch({
      type: "SYNC_LEARNING_TOGGLE",
      payload: {
        learning: !!opts.learningMode,
        learnThenRecall: !!opts.learnThenRecall,
      },
    });
  }, [
    state.started,
    state.finished,
    dispatch,
    opts.learningMode,
    opts.learnThenRecall,
  ]);

  return { setPhase };
}
