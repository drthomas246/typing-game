import { useCallback, useState } from "react";
import { shuffle } from "@/hooks/typingEngine/rng";
import type { EngineOptions, QAPair } from "@/types/index";

/**
 * タイピングゲームの問題の出題順序を管理するカスタムフック。
 * 問題セット (`QAPair[]`) とオプション (`EngineOptions`) に基づいて、
 * 問題の順序を初期化（ランダムまたはシーケンシャル）し、指定されたインデックスの問題を取得する機能を提供します。
 *
 * @param {QAPair[]} QA - 問題データの配列。
 * @param {EngineOptions} opts - エンジンのオプション。特に`seed`と`randomOrder`が使用されます。
 * @param {number} [opts.seed] - 問題のシャッフルに使用するシード値。`randomOrder`が`true`の場合に有効。
 * @param {boolean} [opts.randomOrder=true] - 問題をランダムな順序で出題するかどうか。`false`の場合、元の順序で出題。
 * @returns {object} 問題の順序、初期化関数、問題取得関数を含むオブジェクト。
 * @returns {number[]} .order - 現在の問題の出題順序を示すインデックスの配列。
 * @returns {() => void} .initOrder - 問題の出題順序を初期化する関数。
 * @returns {(index: number) => QAPair} .getPair - 指定された出題順序のインデックスに対応する`QAPair`を返す関数。
 */
export function useSequence(QA: QAPair[], opts: EngineOptions) {
	const [order, setOrder] = useState<number[]>([]);

	const initOrder = useCallback(() => {
		const seed = opts.seed ?? Date.now() % 1_000_000;
		const indices = Array.from({ length: QA.length }, (_, i) => i);
		const useRandom = opts.randomOrder ?? true;
		setOrder(useRandom ? shuffle(indices, seed) : indices);
	}, [QA.length, opts.seed, opts.randomOrder]);

	const getPair = useCallback(
		(index: number): QAPair => {
			const pairIndex = order[index] ?? 0;
			return QA[pairIndex] ?? QA[0];
		},
		[order, QA],
	);

	return { order, initOrder, getPair };
}
