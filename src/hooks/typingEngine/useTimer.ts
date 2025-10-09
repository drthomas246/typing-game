import { useEffect, useState } from "react";

/**
 * タイピングゲームの時間を定期的に更新するためのカスタムフック。
 * ゲームの開始と終了状態に基づいてタイマーを起動・停止し、現在時刻を提供します。
 *
 * @param {number} tickMs - タイマーが更新される間隔（ミリ秒）。
 * @param {boolean} started - ゲームが開始されているかどうかを示すフラグ。
 * @param {boolean} finished - ゲームが終了しているかどうかを示すフラグ。
 * @returns {{ nowMs: number }} 現在時刻（ミリ秒）を含むオブジェクト。
 * @returns {number} .nowMs - 現在のUNIXタイムスタンプ（ミリ秒）。
 */
export function useTimer(tickMs: number, started: boolean, finished: boolean) {
	const [nowMs, setNowMs] = useState<number>(Date.now());

	useEffect(() => {
		if (!started || finished) return;
		setNowMs(Date.now());
		const id = setInterval(() => setNowMs(Date.now()), tickMs);
		return () => clearInterval(id);
	}, [started, finished, tickMs]);

	return { nowMs };
}
