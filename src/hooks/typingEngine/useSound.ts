import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { useSound as useBGMSound } from "@/contexts/PageContext";
import type { EngineOptions, HowlOrNull, SoundCtl } from "@/types/index";

/**
 * BGM（背景音楽）と効果音（SE）の再生を管理するためのカスタムフック。
 * `howler.js`ライブラリを使用して音声ファイルを扱い、ゲームオプションに基づいて音量や音源をカスタマイズできます。
 *
 * @param {EngineOptions} opts - エンジンのオプション設定。BGMや効果音のパス、音量などが含まれます。
 * @param {string} [opts.bgmSrc='./music/bgm/battle.mp3'] - BGMの音源ファイルパス。
 * @param {number} [opts.bgmVolume=0.5] - BGMの音量（0.0から1.0）。
 * @param {number} [opts.sfxVolume=0.8] - 効果音の音量（0.0から1.0）。
 * @param {string} [opts.sfxSlashSrc='./music/soundEffects/killInSword.mp3'] - スラッシュ効果音の音源ファイルパス。
 * @param {string} [opts.sfxPunchSrc='./music/soundEffects/punch.mp3'] - パンチ効果音の音源ファイルパス。
 * @param {string} [opts.sfxDefeatSrc='./music/soundEffects/defeat.mp3'] - 敗北効果音の音源ファイルパス。
 * @param {string} [opts.sfxEscapeSrc='./music/soundEffects/escape.mp3'] - エスケープ効果音の音源ファイルパス。
 * @param {string} [opts.sfxFallDownSrc='./music/soundEffects/fallDown.mp3'] - ダウン効果音の音源ファイルパス。
 * @param {string} [opts.sfxLevelUpSrc='./music/soundEffects/lvup.mp3'] - レベルアップ効果音の音源ファイルパス。
 * @param {string} [opts.sfxKeyOnSrc='./music/soundEffects/keyon.mp3'] - キーオン効果音の音源ファイルパス。
 * @returns {SoundCtl} サウンド制御オブジェクト。BGMの再生/停止関数と、各種効果音の再生関数が含まれます。
 * @returns {function(): void} .playBgm - BGMを再生する関数。
 * @returns {function(): void} .stopBgm - BGMを停止する関数。
 * @returns {object} .sfx - 各種効果音を再生する関数を含むオブジェクト。
 * @returns {function(): void} .sfx.slash - スラッシュ効果音を再生する関数。
 * @returns {function(): void} .sfx.punch - パンチ効果音を再生する関数。
 * @returns {function(): void} .sfx.defeat - 敗北効果音を再生する関数。
 * @returns {function(): void} .sfx.escape - エスケープ効果音を再生する関数。
 * @returns {function(): void} .sfx.fallDown - ダウン効果音を再生する関数。
 * @returns {function(): void} .sfx.levelUp - レベルアップ効果音を再生する関数。
 * @returns {function(): void} .sfx.keyOn - キーオン効果音を再生する関数。
 */
export function useSound(opts: EngineOptions): SoundCtl {
  const sound = useBGMSound();
  const bgmEnabled = sound;
  const bgmSrc = opts.bgmSrc ?? "./music/bgm/battle.mp3";
  const bgmVolume = Math.min(1, Math.max(0, opts.bgmVolume ?? 0.5));
  const bgmRef = useRef<HowlOrNull>(null);

  /**
   * BGMの再生を開始する関数。
   * `bgmEnabled`が`true`の場合のみ実行され、既に再生中の場合は何もしません。
   * 新しいBGMを再生する前に、既存のBGMを停止・アンロードします。
   */
  const playBgm = useCallback(() => {
    if (!bgmEnabled) return;
    if (bgmRef.current?.playing()) return;
    if (bgmRef.current) {
      try {
        bgmRef.current.stop();
        bgmRef.current.unload();
      } catch {
        /* ignore */
      }
      bgmRef.current = null;
    }
    const howl = new Howl({
      src: [bgmSrc],
      loop: true,
      volume: bgmVolume,
      html5: false,
    });
    bgmRef.current = howl;
    howl.play();
  }, [bgmEnabled, bgmSrc, bgmVolume]);

  /**
   * BGMの再生を停止し、リソースを解放する関数。
   * BGMが再生されていない場合は何もしません。
   */
  const stopBgm = useCallback(() => {
    if (!bgmRef.current) return;
    try {
      bgmRef.current.stop();
      bgmRef.current.unload();
    } catch {
      /* ignore */
    }
    bgmRef.current = null;
  }, []);

  const sfxEnabled = sound;
  const sfxVolume = Math.min(1, Math.max(0, opts.sfxVolume ?? 0.8));
  /**
   * 効果音のHowlインスタンスを保持する参照オブジェクト。
   * 各効果音タイプに対応するHowlインスタンスが格納されます。
   */
  const ref = useRef<{
    slash: HowlOrNull;
    punch: HowlOrNull;
    defeat: HowlOrNull;
    escape: HowlOrNull;
    fallDown: HowlOrNull;
    levelUp: HowlOrNull;
    keyOn: HowlOrNull;
  }>({
    slash: null,
    punch: null,
    defeat: null,
    escape: null,
    fallDown: null,
    levelUp: null,
    keyOn: null,
  });

  /**
   * 各効果音の音源ファイルパスを定義したオブジェクト。
   * `EngineOptions`で指定されたパスが優先され、ない場合はデフォルト値が使用されます。
   */
  const src = {
    slash: opts.sfxSlashSrc ?? "./music/soundEffects/killInSword.mp3",
    punch: opts.sfxPunchSrc ?? "./music/soundEffects/punch.mp3",
    defeat: opts.sfxDefeatSrc ?? "./music/soundEffects/defeat.mp3",
    escape: opts.sfxEscapeSrc ?? "./music/soundEffects/escape.mp3",
    fallDown: opts.sfxFallDownSrc ?? "./music/soundEffects/fallDown.mp3",
    levelUp: opts.sfxLevelUpSrc ?? "./music/soundEffects/lvup.mp3",
    keyOn: opts.sfxKeyOnSrc ?? "./music/soundEffects/keyon.mp3",
  };

  /**
   * 指定された効果音のHowlインスタンスが存在しない場合に新しく作成し、`ref`に格納するヘルパー関数。
   *
   * @param {keyof typeof ref.current} k - 効果音のキー（例: 'slash'）。
   * @param {string} path - 効果音の音源ファイルパス。
   */
  const ensure = (k: keyof typeof ref.current, path: string) => {
    if (!ref.current[k]) {
      ref.current[k] = new Howl({
        src: [path],
        volume: sfxVolume,
        html5: false,
      });
    }
  };

  /**
   * 指定された効果音を再生する関数。
   * `sfxEnabled`が`true`の場合のみ実行され、必要に応じてHowlインスタンスを`ensure`関数で作成します。
   *
   * @param {keyof typeof ref.current} k - 効果音のキー（例: 'slash'）。
   * @param {string} path - 効果音の音源ファイルパス。
   */
  const play = (k: keyof typeof ref.current, path: string) => {
    if (!sfxEnabled) return;
    ensure(k, path);
    try {
      ref.current[k]?.play();
    } catch {
      /* ignore */
    }
  };

  /**
   * コンポーネントがアンマウントされる際に、BGMとすべての効果音のリソースを解放するためのエフェクト。
   */
  useEffect(() => {
    return () => {
      stopBgm();
      try {
        ref.current.slash?.unload();
      } catch {
        /* ignore */
      }
      try {
        ref.current.punch?.unload();
      } catch {
        /* ignore */
      }
      try {
        ref.current.defeat?.unload();
      } catch {
        /* ignore */
      }
      try {
        ref.current.escape?.unload();
      } catch {
        /* ignore */
      }
      try {
        ref.current.fallDown?.unload();
      } catch {
        /* ignore */
      }
      try {
        ref.current.levelUp?.unload();
      } catch {
        /* ignore */
      }
      try {
        ref.current.keyOn?.unload();
      } catch {
        /* ignore */
      }
      ref.current = {
        slash: null,
        punch: null,
        defeat: null,
        escape: null,
        fallDown: null,
        levelUp: null,
        keyOn: null,
      };
    };
  }, [stopBgm]);

  return {
    playBgm,
    stopBgm,
    sfx: {
      slash: () => play("slash", src.slash),
      punch: () => play("punch", src.punch),
      defeat: () => play("defeat", src.defeat),
      escape: () => play("escape", src.escape),
      fallDown: () => play("fallDown", src.fallDown),
      levelUp: () => play("levelUp", src.levelUp),
      keyOn: () => play("keyOn", src.keyOn),
    },
  };
}
