import { useEffect, useRef } from "react";
import { useBattle } from "@/contexts/PageContext";
import { useSpeech } from "@/hooks/useSpeech";
import type { EngineOptions, EngineState } from "@/types/index";

/**
 * タイピングゲームの学習フェーズにおいて、問題の単語を一度だけ音声で読み上げるカスタムフック。
 * ゲームの状態、特に学習フェーズが"study"の場合に、`useSpeech`フックを利用して単語を発話します。
 * 同じ単語が複数回読み上げられないように、`spokenRef`を使用して管理します。
 *
 * @param {object} params - このフックが受け取るパラメータオブジェクト。
 * @param {EngineState} params.state - 現在のタイピングエンジンの状態。
 * @param {EngineOptions} params.opts - エンジンのオプション設定（現在は直接使用されていないが、将来的な拡張のために含まれる可能性あり）。
 * @param {string} [params.lang="en-US"] - 音声読み上げに使用する言語コード。デフォルトは"en-US"（英語）。
 */
export function useSpeechOnce(params: {
  state: EngineState;
  opts: EngineOptions;
  lang?: string;
}) {
  const battle = useBattle();
  const { state, lang = "en-US" } = params;
  const { speak } = useSpeech();
  const spokenRef = useRef<string>("");

  useEffect(() => {
    if (!state.started || state.finished) return;
    if (!battle) return;
    if (!state.answerEn) return;
    if (state.learningPhase !== "study") return;

    const key = `${state.index}:${state.answerEn}`;
    if (spokenRef.current !== key) {
      spokenRef.current = key;
      try {
        speak(state.answerEn, { lang });
      } catch {
        try {
          /* @ts-expect-error Compatible call */
          speak(state.answerEn, lang);
        } catch {
          /* ignore */
        }
      }
    }
  }, [state, battle, lang, speak]);
}
