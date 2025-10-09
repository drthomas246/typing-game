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

/**
 * タイピングゲームのコアロジックを統合的に管理するカスタムフック。
 * ゲームの状態、入力処理、サウンド再生、学習フェーズ、問題のシーケンスなどをオーケストレートし、
 * タイピングゲーム全体のエクスペリエンスを提供します。
 *
 * @param {EngineOptions} opts - エンジンの初期化と動作に関するオプション設定。
 * @param {QAPair[]} QA - 出題される問題の`QAPair`配列。
 * @param {React.Dispatch<React.SetStateAction<number>>} setSlashId - 敵への攻撃アニメーションをトリガーするための状態更新関数。
 * @param {React.Dispatch<React.SetStateAction<number>>} setHurtId - プレイヤーの被弾アニメーションをトリガーするための状態更新関数。
 * @param {React.Dispatch<React.SetStateAction<number>>} setVanishId - 問題が消滅するアニメーションをトリガーするための状態更新関数。
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVanished - 問題が完全に消滅した状態を管理するための状態更新関数。
 * @returns {object} タイピングエンジンを制御するための関数と現在の状態を含むオブジェクト。
 * @returns {EngineState} .state - 現在のタイピングエンジンの状態。
 * @returns {() => void} .start - ゲームを開始する関数。
 * @returns {(reason?: "escape" | "user" | "dead" | "victory") => void} .stop - ゲームを停止する関数。
 * @returns {() => void} .next - 次の問題へ進む関数。
 * @returns {(key: string) => void} .onKey - キーボード入力を処理する関数。
 * @returns {(phase: LearningPhase) => void} .setLearningPhase - 学習フェーズを設定する関数。
 * @returns {number} .actualTimeSec - 実際の経過時間（秒）。
 */
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

	/**
	 * ゲームを開始するためのコールバック関数。
	 * アニメーションの状態をリセットし、問題順序を初期化し、BGMを再生します。
	 * エンジンの状態を`START`アクションで更新し、プレイヤーと敵のHP、学習モード、プレイ回数を設定します。
	 */
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
	}, [initOrder, battle, opts.playerMaxHp, opts.enemyMaxHp, setVanishId, setVanished, sound]);

	const talliedFinalRef = useRef(false);
	/**
	 * ゲームを停止するためのコールバック関数。
	 * 最終的な問題をTALLYし、指定された理由に基づいてBGMを停止し、勝敗を決定します。
	 *
	 * @param {"escape" | "user" | "dead" | "victory"} [reason] - ゲームが停止した理由。
	 *   - `escape`: ユーザーが脱出した場合。
	 *   - `user`: ユーザーが明示的に停止した場合。
	 *   - `dead`: プレイヤーまたは敵のHPが0になった場合。
	 *   - `victory`: プレイヤーが勝利した場合。
	 */
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

	/**
	 * 次の問題へ進むためのコールバック関数。
	 * 次の問題が存在しない場合、ゲームを終了させます。
	 * そうでない場合は、次の問題をロードし、エンジンの状態を更新します。
	 */
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

	const { onMiss, onSentenceClear } = useBattle(opts, sound, setHurtId, setSlashId, dispatch);

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
	}, [state.started, state.finished, state.answerEn, order.length, getPair, battle]);

	/**
	 * ゲームの実際の経過時間を秒単位で計算するメモ化された値。
	 * ゲームが開始されていないか、開始時刻が設定されていない場合は0を返します。
	 */
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
