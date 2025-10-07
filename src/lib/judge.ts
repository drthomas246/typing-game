import type { JudgeResult } from "@/types/index";

/**
 * 文字がアルファベットであれば小文字に変換し、それ以外の場合は元の文字を返すヘルパー関数。\n
 * 大文字・小文字を区別しない判定に使用されます。\n
 *\n
 * @param {string} ch - 変換する文字。\n
 * @returns {string} 変換後の文字。\n
 */
const lowerIfAlpha = (ch: string) =>
  /[a-z]/i.test(ch) ? ch.toLowerCase() : ch;

/**
 * 入力されたキーが、期待される英単語の現在のカーソル位置の文字と一致するかどうかを判定する関数。
 * 大文字・小文字を区別せず、改行やバックスペースキーは常に不正な入力と見なされます。
 *
 * @param {string} answerEn - 期待される正しい英単語の文字列。
 * @param {number} cursor - 現在入力されている文字のカーソル位置（0から始まるインデックス）。
 * @param {string} key - ユーザーが入力したキーの文字。
 * @returns {JudgeResult} 判定結果を含むオブジェクト。
 * @returns {boolean} .ok - 入力文字が正しかったかどうか（`true`で正しい）。
 * @returns {string} .expected - 期待された文字。
 * @returns {string} .received - 実際に入力された文字。
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
