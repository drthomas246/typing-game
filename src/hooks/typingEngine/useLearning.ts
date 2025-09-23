import { useCallback, useEffect } from "react";
import { useBattle } from "@/contexts/PageContext";
import type {
	Action,
	EngineOptions,
	EngineState,
	LearningPhase,
} from "@/types/index";

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
