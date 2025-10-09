import { useCallback, useEffect } from "react";
import { useBattle } from "@/contexts/PageContext";
import type {
  Action,
  EngineOptions,
  EngineState,
  LearningPhase,
} from "@/types/index";

/**
 * タイピングゲームの学習フェーズ（"study"または"recall"）の状態と遷移を制御するカスタムフック。
 * 学習モードの有効/無効、そして「練習→復習」のフローに基づいて、ヒントの表示状態を管理します。
 *
 * @param {object} params - このフックが受け取るパラメータオブジェクト。
 * @param {EngineState} params.state - 現在のタイピングエンジンの状態。
 * @param {React.Dispatch<Action>} params.dispatch - タイピングエンジンの状態を更新するためのディスパッチ関数。
 * @param {EngineOptions} params.opts - エンジンのオプション設定。特に`learnThenRecall`プロパティが使用されます。
 * @returns {{ setPhase: (phase: LearningPhase) => void }} 学習フェーズを設定する関数を含むオブジェクト。
 * @returns {function(phase: LearningPhase): void} .setPhase - 指定された学習フェーズに状態を更新し、ヒントの表示状態を調整するコールバック関数。
 */
export function useLearning(params: {
  state: EngineState;
  dispatch: React.Dispatch<Action>;
  opts: EngineOptions;
}) {
  const battle = useBattle();
  const { state, dispatch, opts } = params;

  const setPhase = useCallback(
    (phase: LearningPhase) => {
      const learning = !!battle;
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
    [dispatch, battle, opts.learnThenRecall],
  );

  useEffect(() => {
    if (!state.started || state.finished) return;
    dispatch({
      type: "SYNC_LEARNING_TOGGLE",
      payload: {
        learning: !!battle,
        learnThenRecall: !!opts.learnThenRecall,
      },
    });
  }, [state.started, state.finished, dispatch, battle, opts.learnThenRecall]);

  return { setPhase };
}
