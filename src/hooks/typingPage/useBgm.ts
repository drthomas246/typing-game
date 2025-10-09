import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";

/**
 * タイピング画面のBGM（背景音楽）の再生を制御するためのカスタムフック。
 * `howler.js`ライブラリを使用してBGMをロード、再生、停止し、
 * `opts`で指定された設定に基づいて動作します。
 *
 * @param {object} opts - BGMのオプション設定。
 * @param {string} opts.src - BGMの音源ファイルパス。
 * @param {boolean} [opts.loop=true] - BGMをループ再生するかどうか。デフォルトは`true`。
 * @param {number} [opts.volume=0.4] - BGMの音量（0.0から1.0）。デフォルトは`0.4`。
 * @param {boolean | undefined} opts.enabled - BGMの再生が許可されているかどうかを示すフラグ。`true`の場合に再生が試みられます。
 * @returns {{ shouldPlay: boolean | undefined; setShouldPlay: React.Dispatch<React.SetStateAction<boolean | undefined>> }} BGMの再生状態と、その状態を更新する関数を含むオブジェクト。
 * @returns {boolean | undefined} .shouldPlay - 現在BGMが再生されるべきかどうかを示す状態。
 * @returns {React.Dispatch<React.SetStateAction<boolean | undefined>>} .setShouldPlay - BGMの再生状態を更新するための関数。
 */
export function useBgm(opts: {
  src: string;
  loop?: boolean;
  volume?: number;
  enabled: boolean | undefined;
}) {
  const { src, loop = true, volume = 0.4, enabled } = opts;
  const [shouldPlay, setShouldPlay] = useState<boolean | undefined>(enabled);
  const bgmRef = useRef<Howl | null>(null);

  useEffect(() => {
    setShouldPlay(enabled);
  }, [enabled]);

  useEffect(() => {
    if (shouldPlay) {
      if (bgmRef.current?.playing()) return;

      if (!bgmRef.current) {
        bgmRef.current = new Howl({
          src: [src],
          loop,
          volume,
          html5: true,
        });
      }
      try {
        if (!bgmRef.current.playing()) {
          bgmRef.current.play();
        }
      } catch {
        /* ignore */
      }
    } else {
      if (bgmRef.current) {
        try {
          bgmRef.current.stop();
          bgmRef.current.unload();
        } catch {
          /* ignore */
        }
        bgmRef.current = null;
      }
    }
  }, [shouldPlay, src, loop, volume]);

  return { shouldPlay, setShouldPlay };
}
