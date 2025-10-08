import { useCallback, useEffect } from "react";
import * as BGM from "@/lib/bgmManager";

/**
 * グローバルなBGM（バックグラウンドミュージック）の再生と制御を行うカスタムフック。
 * `bgmManager`ユーティリティをラップし、BGMの初期化、再生、停止、音量調整機能を提供します。
 *
 * @param {string} src - BGMの音源ファイルパス。
 * @param {number} [defaultVolume=0.5] - BGMのデフォルト音量（0.0から1.0）。
 * @returns {object} BGMを制御するための関数群を含むオブジェクト。
 * @returns {function(ms?: number, to?: number): void} .ensurePlaying - BGMが再生されていない場合に再生を開始し、オプションでフェードイン時間と目標音量を設定する関数。
 * @returns {function(ms?: number): void} .fadeOutStop - BGMをフェードアウトさせて停止する関数。オプションでフェードアウト時間を設定できます。
 * @returns {function(): void} .stopNow - BGMを直ちに停止する関数。
 * @returns {function(v: number): void} .setTargetVolume - BGMの目標音量を設定する関数。
 * @returns {function(): number} .getTargetVolume - 現在設定されているBGMの目標音量を取得する関数。
 */
export function useBgm(src: string, defaultVolume = 0.5) {
  useEffect(() => {
    BGM.init(src, defaultVolume, true);
  }, [src, defaultVolume]);

  const ensurePlaying = useCallback((ms?: number, to?: number) => {
    BGM.ensurePlaying(ms, to);
  }, []);
  const fadeOutStop = useCallback((ms?: number) => {
    BGM.fadeOutStop(ms);
  }, []);
  const stopNow = useCallback(() => {
    BGM.stopNow();
  }, []);
  const setTargetVolume = useCallback((v: number) => {
    BGM.setTargetVolume(v);
  }, []);
  const getTargetVolume = useCallback(() => BGM.getTargetVolume(), []);

  return {
    ensurePlaying,
    fadeOutStop,
    stopNow,
    setTargetVolume,
    getTargetVolume,
  };
}
