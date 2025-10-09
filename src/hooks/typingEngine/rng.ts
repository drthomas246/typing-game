/**
 * Mulberry32アルゴリズムに基づいた擬似乱数生成器を初期化し、その生成関数を返します。
 * この関数はシード値`a`を受け取り、0以上1未満の浮動小数点数を生成する関数を返します。
 *
 * @param {number} a - 乱数生成器の初期シード値。
 * @returns {() => number} 0以上1未満の浮動小数点数を返す乱数生成関数。
 */
export function mulberry32(a: number) {
	return () => {
		a += 0x6d2b79f5;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * 指定されたシード値に基づいた擬似乱数生成器を使用して配列をシャッフルする関数。
 * 元の配列を変更せずに、新しいシャッフルされた配列を返します。
 *
 * @template T - 配列の要素の型。
 * @param {T[]} arr - シャッフルする配列。
 * @param {number} seed - 乱数生成器のシード値。同じシード値からは常に同じシャッフル結果が得られます。
 * @returns {T[]} シャッフルされた新しい配列。
 */
export function shuffle<T>(arr: T[], seed: number) {
	const rng = mulberry32(seed);
	return [...arr].sort(() => rng() - 0.5);
}
