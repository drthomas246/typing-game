import { Howl, Howler } from "howler";

/**
 * BGMのフェード処理が完了した際に呼び出されるリスナー関数の型定義。
 */
type Listener = () => void;

/**
 * BGMマネージャーの内部状態を定義する型。
 */
type State = {
  /** Howler.jsのHowlインスタンス。BGM音源を管理します。 */
  howl: Howl | null;
  /** 現在ロードされているBGMの音源パス。 */
  src: string | null;
  /** 目標とするBGMの音量（0.0～1.0）。フェード処理の目標値や非フェード時の音量として使用されます。 */
  targetVolume: number;
  /** BGMが現在フェード中かどうかを示すフラグ。 */
  isFading: boolean;
  /** フェード処理が完了したときに一度だけ呼び出されるリスナー関数。 */
  onFade?: Listener;
};

/**
 * BGMマネージャーの現在の状態を保持するオブジェクト。
 */
const S: State = {
  howl: null,
  src: null,
  targetVolume: 0.5,
  isFading: false,
  onFade: undefined,
};

/**
 * 浮動小数点数の比較における許容誤差。
 * 音量比較などで使用され、非常に小さい差を無視するために使われます。
 */
const EPS = 0.005;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Howlインスタンスにフェード完了リスナーを一度だけアタッチするヘルパー関数。
 * 既にアタッチされているリスナーがあれば解除し、新しいリスナーを設定します。
 *
 * @param {Howl} h - リスナーをアタッチするHowlインスタンス。
 * @param {Listener} cb - フェード完了時に呼び出されるコールバック関数。
 */
function attachFadeOnce(h: Howl, cb: Listener) {
  if (S.onFade) h.off("fade", S.onFade);
  S.onFade = cb;
  h.once("fade", cb);
}

/**
 * BGM (バックグラウンドミュージック) を初期化し、Howler.jsのインスタンスを準備する関数。
 * 既に同じ音源のBGMがロードされている場合は、音量とループ設定を更新します。
 * 異なる音源の場合は、既存のBGMをアンロードしてから新しいBGMをロードします。
 *
 * @param {string} src - BGMの音源ファイルパス。
 * @param {number} [defaultVolume=0.5] - BGMのデフォルト音量（0.0から1.0）。
 * @param {boolean} [loop=true] - BGMをループ再生するかどうか。
 */
export function init(src: string, defaultVolume = 0.5, loop = true) {
  if (Howler.volume() === 0) Howler.volume(1.0);

  if (S.howl && S.src === src) {
    S.targetVolume = clamp01(defaultVolume);
    if (!S.isFading) S.howl.volume(S.targetVolume);
    return;
  }

  if (S.howl) {
    S.howl.stop();
    S.howl.unload();
  }
  S.src = src;
  S.targetVolume = clamp01(defaultVolume);
  S.isFading = false;
  S.onFade = undefined;

  S.howl = new Howl({
    src: [src],
    loop,
    volume: S.targetVolume,
    preload: true,
    html5: false,
  });
}

/**
 * BGMの目標音量を設定する関数。
 * 設定された目標音量は、フェード処理中でない限り、Howlインスタンスに即座に適用されます。
 *
 * @param {number} v - 設定する目標音量（0.0から1.0）。範囲外の値はクランプされます。
 */
export function setTargetVolume(v: number) {
  S.targetVolume = clamp01(v);
  if (S.howl && !S.isFading) {
    S.howl.volume(S.targetVolume);
  }
}

/**
 * BGMの現在設定されている目標音量を取得する関数。
 * この値はフェード処理の目標値や非フェード時の音量として使用されます。
 *
 * @returns {number} 現在の目標音量（0.0から1.0）。
 */
export function getTargetVolume() {
  return S.targetVolume;
}

/**
 * BGMをフェードインしながら再生し、目標音量を維持する関数。
 * BGMが再生中でない場合は、音量を0から目標値までフェードインしながら再生を開始します。
 * 既に再生中の場合は、現在の音量から目標音量までフェードします。
 *
 * @param {number} [ms=800] - フェードにかける時間（ミリ秒）。0以下の場合は即座に音量が設定されます。
 * @param {number} [to] - フェードの目標音量（0.0から1.0）。指定しない場合は`S.targetVolume`が使用されます。
 */
export function ensurePlaying(ms = 800, to?: number) {
  const h = S.howl;
  if (!h) return;
  const target = clamp01(to ?? S.targetVolume);
  const cur = h.volume();

  if (!h.playing()) {
    h.volume(0);
    h.play();
    if (ms > 0) {
      S.isFading = true;
      attachFadeOnce(h, () => {
        S.isFading = false;
      });
      h.fade(0, target, ms);
    } else {
      h.volume(target);
    }
    return;
  }

  if (Math.abs(cur - target) > EPS) {
    if (ms > 0) {
      S.isFading = true;
      attachFadeOnce(h, () => {
        S.isFading = false;
      });
      h.fade(cur, target, ms);
    } else {
      h.volume(target);
    }
  }
}

/**
 * BGMをフェードアウトさせて停止する関数。
 * 現在BGMが再生中であり、かつ音量が微小な値 (`EPS`) より大きい場合にフェードアウト処理を実行します。
 * フェードアウト完了後、BGMは停止され、音量は目標音量 (`S.targetVolume`) にリセットされます。
 *
 * @param {number} [ms=500] - フェードアウトにかける時間（ミリ秒）。デフォルトは`500`ミリ秒。
 */
export function fadeOutStop(ms = 500) {
  const h = S.howl;
  if (!h || !h.playing()) return;
  const cur = h.volume();
  if (cur <= EPS) {
    h.stop();
    h.volume(S.targetVolume);
    return;
  }
  S.isFading = true;
  attachFadeOnce(h, () => {
    h.stop();
    h.volume(S.targetVolume);
    S.isFading = false;
  });
  h.fade(cur, 0, ms);
}

/**
 * BGMを即座に停止する関数。
 * フェード処理を無視し、BGMが再生中であれば直ちに停止し、音量を目標音量にリセットします。
 */
export function stopNow() {
  const h = S.howl;
  if (!h) return;
  h.stop();
  h.volume(S.targetVolume);
}
