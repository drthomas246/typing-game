/**
 * Mulberry32 アルゴリズムの乱数生成器を返す。
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
 * シード付き乱数で配列をシャッフルする。
 */
export function shuffle<T>(arr: T[], seed: number) {
        const rng = mulberry32(seed);
        return [...arr].sort(() => rng() - 0.5);
}
