import type { JudgeResult } from "@/types/index";

const lowerIfAlpha = (ch: string) =>
        /[a-z]/i.test(ch) ? ch.toLowerCase() : ch;

/**
 * 入力文字が期待値と一致するか判定する。
 */
export function judgeChar(
        answerEn: string,
        cursor: number,
        key: string,
): JudgeResult {
	const exp = answerEn[cursor] ?? "";
	if (key === "\n" || key === "\b")
		return { ok: false, expected: exp, received: key };
	const ok = lowerIfAlpha(exp) === lowerIfAlpha(key);
	return { ok, expected: exp, received: key };
}
