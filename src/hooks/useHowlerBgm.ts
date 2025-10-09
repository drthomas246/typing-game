import type { Howl } from "howler";
import { Howler, Howl as HowlerHowl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import type { useHowlerBgmOpts } from "@/types/index";

/**
 * 数値を0.0から1.0の範囲にクランプ（制限）するユーティリティ関数。
 * 主に音量設定などで使用され、不正な値が指定された場合でも安全な範囲に収めます。
 *
 * @param {number} v - クランプする数値。
 * @returns {number} 0.0以上1.0以下の範囲に制限された数値。
 */
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * Howler.js ライブラリを使用してBGM（バックグラウンドミュージック）の再生を制御するカスタムフック。
 * BGMのロード、再生、停止、音量調整、フェードイン/アウト機能をカプセル化し、
 * コンポーネントライフサイクルに合わせたBGM管理を提供します。
 *
 * @param {object} opts - BGMのオプション設定。
 * @param {string} opts.src - BGMの音源ファイルパス。
 * @param {number} [opts.defaultVolume=0.5] - BGMのデフォルト音量（0.0から1.0）。
 * @param {boolean} [opts.loop=true] - BGMをループ再生するかどうか。
 * @returns {object} BGMを制御するための関数群を含むオブジェクト。
 * @returns {Howl | null} .howl - 現在のHowlインスタンス。
 * @returns {function(ms?: number, to?: number): void} .ensurePlaying - BGMが再生されていることを保証する関数。必要に応じてBGMをフェードイン再生します。
 * @returns {function(ms?: number): void} .fadeOutStop - BGMをフェードアウトさせて停止する関数。
 * @returns {function(): void} .stopNow - BGMを即座に停止する関数。
 * @returns {function(v: number): void} .setTargetVolume - BGMの目標音量を設定する関数。
 * @returns {function(): number} .getTargetVolume - BGMの現在の目標音量を取得する関数。
 */
export function useHowlerBgm({
  src,
  defaultVolume = 0.5,
  loop = true,
}: useHowlerBgmOpts) {
  const howlRef = useRef<Howl | null>(null);
  const targetRef = useRef(clamp01(defaultVolume));
  const fadingRef = useRef(false);
  const EPS = 0.005;

  useEffect(() => {
    if (Howler.volume() === 0) Howler.volume(1.0);
  }, []);

  useEffect(() => {
    const h = new HowlerHowl({
      src: [src],
      loop,
      volume: clamp01(targetRef.current),
      preload: true,
      html5: false,
    });
    howlRef.current = h;
    return () => {
      h.stop();
      h.unload();
      howlRef.current = null;
    };
  }, [src, loop]);

  const setTargetVolume = useCallback((v: number) => {
    const vv = clamp01(v);
    targetRef.current = vv;
    const h = howlRef.current;
    if (h && !fadingRef.current) h.volume(vv);
  }, []);

  const getTargetVolume = useCallback(() => targetRef.current, []);

  const ensurePlaying = useCallback((ms = 800, to?: number) => {
    const h = howlRef.current;
    if (!h) return;
    const target = clamp01(to ?? targetRef.current);
    const cur = h.volume();

    if (!h.playing()) {
      h.volume(0);
      h.play();
      if (ms > 0) {
        fadingRef.current = true;
        h.fade(0, target, ms);
        h.once("fade", () => {
          fadingRef.current = false;
        });
      } else {
        h.volume(target);
      }
      return;
    }

    if (Math.abs(cur - target) > EPS) {
      if (ms > 0) {
        fadingRef.current = true;
        h.fade(cur, target, ms);
        h.once("fade", () => {
          fadingRef.current = false;
        });
      } else {
        h.volume(target);
      }
    }
  }, []);

  const fadeOutStop = useCallback((ms = 500) => {
    const h = howlRef.current;
    if (!h || !h.playing()) return;
    const cur = h.volume();
    if (cur <= EPS) {
      h.stop();
      h.volume(targetRef.current);
      return;
    }
    fadingRef.current = true;
    h.fade(cur, 0, ms);
    h.once("fade", () => {
      h.stop();
      h.volume(targetRef.current);
      fadingRef.current = false;
    });
  }, []);

  const stopNow = useCallback(() => {
    const h = howlRef.current;
    if (!h) return;
    h.stop();
    h.volume(targetRef.current);
  }, []);

  return {
    howl: howlRef.current,
    ensurePlaying,
    fadeOutStop,
    stopNow,
    setTargetVolume,
    getTargetVolume,
  };
}
