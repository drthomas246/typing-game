import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useBattle as useBattleContext } from "@/contexts/PageContext";
import { initialState, reducer } from "@/hooks/typingEngine//reducer";
import { useBattle } from "@/hooks/typingEngine//useBattle";
import { useInput } from "@/hooks/typingEngine//useInput";
import { useLearning } from "@/hooks/typingEngine//useLearning";
import { useSequence } from "@/hooks/typingEngine//useSequence";
import { useSound } from "@/hooks/typingEngine//useSound";
import { useSpeechOnce } from "@/hooks/typingEngine//useSpeechOnce";
import { useTimer } from "@/hooks/typingEngine//useTimer";
import { useSpeech } from "@/hooks/useSpeech";
import { judgeChar } from "@/lib/judge";
import type { EngineOptions, QAPair } from "@/types/index";

export function useTypingEngine(
	opts: EngineOptions,
	QA: QAPair[],
	setSlashId: React.Dispatch<React.SetStateAction<number>>,
	setHurtId: React.Dispatch<React.SetStateAction<number>>,
	setVanishId: React.Dispatch<React.SetStateAction<number>>,
	setVanished: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const battle = useBattleContext();
	const [state, dispatch] = useReducer(reducer, initialState(opts));

	const tickMs = Math.max(16, opts.tickMs ?? 100);

	const sound = useSound(opts);
	const { order, initOrder, getPair } = useSequence(QA, opts);
	const { nowMs } = useTimer(tickMs, state.started, state.finished);
	const { setPhase } = useLearning({ state, dispatch, opts });

	const { speak } = useSpeech();

	const playCountRef = useRef(0);

	const start = useCallback(() => {
		setVanishId(0);
		setVanished(false);

		initOrder();

		if (!battle) sound.playBgm();

		dispatch({
			type: "START",
			payload: {
				now: Date.now(),
				playerMaxHp: Math.max(1, opts.playerMaxHp ?? 100),
				enemyMaxHp: Math.max(1, opts.enemyMaxHp ?? 100),
				learning: !!battle,
				playCount: playCountRef.current,
			},
		});
	}, [
		initOrder,
		battle,
		opts.playerMaxHp,
		opts.enemyMaxHp,
		setVanishId,
		setVanished,
		sound,
	]);

	const talliedFinalRef = useRef(false);
	const stop = useCallback(
		(reason?: "escape" | "user" | "dead" | "victory") => {
			if (!talliedFinalRef.current) {
				dispatch({ type: "TALLY_QUESTION" });
				talliedFinalRef.current = true;
			}

			if (reason === "escape" && !battle) {
				sound.sfx.escape();
			}

			sound.stopBgm();

			let victory: boolean | undefined = state.victory;
			if (reason === "escape" || reason === "dead") victory = false;
			if (reason === "victory") victory = true;

			dispatch({ type: "STOP", payload: { victory } });
			playCountRef.current += 1;
		},
		[battle, sound, state.victory],
	);

	const next = useCallback(() => {
		const nextIndex = state.index + 1;
		const hasNext = nextIndex < order.length;

		if (!hasNext) {
			sound.stopBgm();
			dispatch({ type: "FINISH", payload: { victory: state.enemyHp <= 0 } });
			return;
		}

		const pair = getPair(nextIndex);
		dispatch({
			type: "LOAD_PAIR",
			payload: { index: nextIndex, pair, learning: !!battle },
		});
	}, [state.index, order.length, getPair, sound, state.enemyHp, battle]);

	useSpeechOnce({ state, opts, lang: "en-US" });

	const { onMiss, onSentenceClear } = useBattle(
		opts,
		sound,
		setHurtId,
		setSlashId,
		dispatch,
	);

	const { onKey } = useInput({
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
	});

	useEffect(() => {
		if (!state.started || state.finished) return;
		if (state.answerEn !== "") return;
		if (order.length === 0) return;

		const first = getPair(0);
		dispatch({
			type: "LOAD_PAIR",
			payload: { index: 0, pair: first, learning: !!battle },
		});
	}, [
		state.started,
		state.finished,
		state.answerEn,
		order.length,
		getPair,
		battle,
	]);

	const actualTimeSec = useMemo(() => {
		if (!state.started || !state.startAt) return 0;
		return Math.max(0, Math.floor((nowMs - state.startAt) / 1000));
	}, [state.started, state.startAt, nowMs]);

	return {
		state,
		start,
		stop,
		next,
		onKey,
		setLearningPhase: setPhase,
		actualTimeSec,
	};
}
