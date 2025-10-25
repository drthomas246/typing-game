import { useEffect } from "react";
import type { InputCaptureProps } from "@/types/index";

/**
 * ページ全体のキーボード入力をキャプチャし、指定されたハンドラに渡す非表示コンポーネント。
 * このコンポーネントはUIをレンダリングせず、`useEffect` を利用してグローバルな `keydown` イベントリスナーを登録・解除します。
 * これにより、特定の入力フィールドにフォーカスがなくても、アプリケーション全体でタイピング入力を受け付けることが可能になります。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.onKey - キーが押されたときに呼び出されるコールバック関数。特殊キーは `\t`, `\b`, `\n` などに正規化されて渡されます。
 * @param props.enabled - `true`の場合にのみキーボードイベントをキャプチャします。デフォルトは `true`。
 * @param props.handleEnter - Enterキーを処理するかどうか。デフォルトは `true`。
 * @param props.handleBackspace - Backspaceキーを処理するかどうか。デフォルトは `true`。
 * @param props.handleSpace - Spaceキーを処理するかどうか。デフォルトは `true`。
 * @param props.handleTab - Tabキーを処理するかどうか。デフォルトは `true`。
 */
export function InputCapture({
  onKey,
  enabled = true,
  handleEnter = true,
  handleBackspace = true,
  handleSpace = true,
  handleTab = true,
}: InputCaptureProps) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (!enabled) return;

      if (handleTab && e.key === "Tab") {
        onKey("\t", e);
        e.preventDefault();
        return;
      }
      if (handleSpace && (e.key === " " || e.code === "Space")) {
        onKey(" ", e);
        e.preventDefault();
        return;
      }
      if (e.key.length === 1) {
        onKey(e.key, e);
        e.preventDefault();
        return;
      }
      if (handleBackspace && e.key === "Backspace") {
        onKey("\b", e);
        e.preventDefault();
        return;
      }
      if (handleEnter && e.key === "Enter") {
        onKey("\n", e);
        e.preventDefault();
        return;
      }
    };

    window.addEventListener("keydown", handler, { capture: true });

    return () =>
      window.removeEventListener("keydown", handler, { capture: true });
  }, [onKey, enabled, handleEnter, handleBackspace, handleSpace, handleTab]);

  return null;
}
