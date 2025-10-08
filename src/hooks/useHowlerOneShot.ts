import type { Howl } from "howler";
import { Howl as HowlerHowl } from "howler";
import { useEffect, useRef } from "react";

/**
 * Howler.jsライブラリを使用して、指定された音源を一度だけ再生するためのカスタムフック。
 * 主に効果音（SFX）のように、トリガーされたときに単発で再生される音源に使用されます。
 * コンポーネントのマウント時に音源をプリロードし、アンマウント時にリソースを解放します。
 *
 * @param {string} src - 再生する音源ファイルパス。
 * @param {number} [volume=1.0] - 音源の再生音量（0.0から1.0）。デフォルトは`1.0`。
 * @returns {{ play: () => void }} 音源を再生するための関数を含むオブジェクト。
 * @returns {function(): void} .play - 音源を再生するコールバック関数。
 */
export function useHowlerOneShot(src: string, volume = 1.0) {
  const ref = useRef<Howl | null>(null);

  useEffect(() => {
    const h = new HowlerHowl({ src: [src], volume, preload: true });
    ref.current = h;
    return () => {
      h.unload();
      ref.current = null;
    };
  }, [src, volume]);

  return { play: () => ref.current?.play() };
}
