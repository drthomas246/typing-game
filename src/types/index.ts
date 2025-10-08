import type {
  Tooltip as ChakraTooltip,
  IconButtonProps,
} from "@chakra-ui/react";
import type { useAnimation } from "framer-motion";
import type { Howl } from "howler";
import type { ThemeProviderProps } from "next-themes";

/**
 * アプリ全体で共有する型定義をまとめたモジュール。
 */

/**
 * カラーモード切り替えボタンのプロパティ。
 * Chakra UIのIconButtonPropsから'aria-label'を除外したもの。
 */
export type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

/**
 * カスタムTooltipコンポーネントのプロパティインターフェース。
 */
export interface TooltipProps extends ChakraTooltip.RootProps {
  /** ツールチップの矢印を表示するかどうか。 */
  showArrow?: boolean;
  /** ポータルを使用してレンダリングするかどうか。 */
  portalled?: boolean;
  /** ポータルのターゲットとなるDOM要素のRef。 */
  portalRef?: React.RefObject<HTMLElement>;
  /** ツールチップに表示するコンテンツ。 */
  content: React.ReactNode;
  /** ツールチップの内容コンポーネントに渡すプロパティ。 */
  contentProps?: ChakraTooltip.ContentProps;
  /** ツールチップを無効にするかどうか。 */
  disabled?: boolean;
}

/**
 * カラーモードプロバイダーのプロパティ。next-themesのThemeProviderPropsのエイリアス。
 */
export type ColorModeProviderProps = ThemeProviderProps;

/**
 * カラーモードの値。
 */
export type ColorMode = "light" | "dark";

/**
 * カスタム`useColorMode`フックの戻り値インターフェース。
 */
export interface UseColorModeReturn {
  /** 現在のカラーモード。 */
  colorMode: ColorMode;
  /** カラーモードを設定する関数。 */
  setColorMode: (colorMode: ColorMode) => void;
  /** カラーモードを切り替える関数。 */
  toggleColorMode: () => void;
}

/**
 * キーボード入力キャプチャコンポーネントのプロパティ。
 */
export type InputCaptureProps = {
  /** キー入力時のコールバック関数。文字と元のKeyboardEventを渡す。 */
  onKey: (ch: string, e: KeyboardEvent) => void;
  /** 入力キャプチャを有効にするかどうか。 */
  enabled?: boolean;
  /** Enterキーの入力を処理するかどうか。 */
  handleEnter?: boolean;
  /** Backspaceキーの入力を処理するかどうか。 */
  handleBackspace?: boolean;
  /** Spaceキーの入力を処理するかどうか。 */
  handleSpace?: boolean;
  /** Tabキーの入力を処理するかどうか。 */
  handleTab?: boolean;
};

/**
 * タイピング結果ダイアログのプロパティ。
 */
export type ResultsDialogProps = {
  /** ダイアログが開いているかどうか。 */
  open: boolean;
  /** ダイアログの開閉状態を設定する関数。 */
  setOpen: (v: boolean) => void;
  /** リトライボタンが押されたときのコールバック。 */
  onRetry: () => void;
  /** BGM再生状態を設定する関数。 */
  setShouldBgmPlay: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  /** タイピングの結果概要。 */
  summary: {
    /** 完了までにかかった時間（秒）。 */
    timeSec: number;
    /** 使用したヒントの回数。 */
    usedHintCount: number;
    /** ミスをした問題の数。 */
    mistakeProblemCount: number;
    /** バトルモードで敵を倒した（Killed）かどうか。 */
    killedNow: boolean;
  };
};

/**
 * 質問と回答のペアのインターフェース。
 */
export interface QAPair {
  /** 日本語の質問文。 */
  ja: string;
  /** 英語の回答文（タイピング対象）。 */
  en: string;
  /** 質問に関連する画像のパス。 */
  img?: string;
}

/**
 * 一文字のタイピング判定結果の型。
 */
export type JudgeResult = {
  /** 入力が正しかったか。 */
  ok: boolean;
  /** 期待されていた文字。 */
  expected: string;
  /** 実際に入力された文字。 */
  received: string;
};

/**
 * 音声読み上げ（Speech Synthesis）のオプション。
 */
export type SpeakOpts = {
  /** 言語コード（例: 'ja-JP'）。 */
  lang?: string;
  /** 読み上げ速度（0.1〜10）。 */
  rate?: number;
  /** ピッチ（高さ）（0〜2）。 */
  pitch?: number;
  /** 使用する声のヒント。 */
  voiceHint?: string;
  /** 重複読み上げを防止する期間（ミリ秒）。 */
  dedupeMs?: number;
  /** 重複防止を無効にするか。 */
  noDedupe?: boolean;
};

/**
 * タイピングエンジンの動作オプション。
 */
export interface EngineOptions {
  /** エンジンティックの間隔（ミリ秒）。 */
  tickMs?: number;

  /** バトルモードを有効にするか。 */
  battleMode?: boolean;
  /** プレイヤーの最大HP。 */
  playerMaxHp?: number;
  /** 敵の最大HP。 */
  enemyMaxHp?: number;
  /** ミス1回あたりのダメージ量。 */
  damagePerMiss?: number;
  /** 1文完了あたりのダメージ量。 */
  damagePerSentence?: number;

  /** 全体的なサウンドを有効にするか。 */
  sound?: boolean;

  /** BGMを有効にするか。 */
  bgm?: boolean;
  /** BGMファイルのソースパス。 */
  bgmSrc?: string;
  /** BGMの音量。 */
  bgmVolume?: number;

  /** 効果音（SFX）を有効にするか。 */
  sfx?: boolean;
  /** 効果音の音量。 */
  sfxVolume?: number;
  /** 斬撃効果音のソースパス。 */
  sfxSlashSrc?: string;
  /** パンチ効果音のソースパス。 */
  sfxPunchSrc?: string;
  /** 敗北効果音のソースパス。 */
  sfxDefeatSrc?: string;
  /** 逃走効果音のソースパス。 */
  sfxEscapeSrc?: string;
  /** 転倒効果音のソースパス。 */
  sfxFallDownSrc?: string;
  /** レベルアップ効果音のソースパス。 */
  sfxLevelUpSrc?: string;
  /** キー入力効果音のソースパス。 */
  sfxKeyOnSrc?: string;

  /** 学習フェーズ後に復習フェーズ（Learn Then Recall）を行うか。 */
  learnThenRecall?: boolean;

  /** 問題をランダムな順序にするか。 */
  randomOrder?: boolean;
  /** 乱数シード。 */
  seed?: number;
  /** 正解1文字あたりのダメージ量（敵へのダメージ？）。 */
  damagePerHit?: number;
  /** 学習モードを有効にするか。 */
  learningMode?: boolean;
}

import type { useTypingEngine } from "@/hooks/typingEngine/useTypingEngine";
/**
 * タイピングエンジンのフック（`useTypingEngine`）の戻り値の型。
 */
export type EngineLike = ReturnType<typeof useTypingEngine>;

/**
 * アプリケーションのユーザー設定。
 */
export type Settings = {
  /** 使用する言語。 */
  language: string;
  /** 学習フェーズ後に復習フェーズを行うか。 */
  learnThenRecall: boolean;
};

/**
 * 設定ドロワーコンポーネントのプロパティ。
 */
export type SettingsDrawerProps = {
  /** ドロワーが開いているかどうか。 */
  open: boolean;
  /** ドロワーを閉じる関数。 */
  onClose: () => void;
  /** 現在の設定オブジェクト。 */
  settings: Settings;
  /** 設定が変更されたときのコールバック。 */
  onChange: (s: Settings) => void;
  /** 制御対象のタイピングエンジンインスタンス。 */
  engine?: EngineLike;
};

/**
 * `decode()`メソッドを持つ拡張されたHTMLImageElement。
 * 画像のデコード完了を待つために使用される。
 */
export type DecodableImage = HTMLImageElement & {
  /** 画像のデコード完了を待つPromiseを返すメソッド。 */
  decode?: () => Promise<void>;
};

/**
 * `Howler`オブジェクトに`AudioContext`の参照を追加した型。
 */
export type HowlerWithCtx = typeof Howler & { ctx?: AudioContext };

/**
 * framer-motionの`useAnimation`フックの戻り値の型。
 */
export type Controls = ReturnType<typeof useAnimation>;

/**
 * マップ上のクリック可能なポイントのデータ構造。
 */
export type MapPoint = {
  /** ページ遷移に使用される一意のID。 */
  id: number;
  /** マップ上のX座標。 */
  x: number;
  /** マップ上のY座標。 */
  y: number;
  /** 問題のタイトル。 */
  title: string;
  /** 関連する質問と回答のペアの配列。 */
  QA: QAPair[];
};

/**
 * タイピング学習のフェーズ。
 */
export type LearningPhase = "study" | "recall";

/**
 * タイピングエンジンの状態インターフェース。
 */
export interface EngineState {
  /** エンジンが開始されているか。 */
  started: boolean;
  /** エンジンが終了（勝利/敗北/エスケープ）したか。 */
  finished: boolean;
  /** 開始時刻のタイムスタンプ。 */
  startAt?: number;
  /** 勝利したか。 */
  victory?: boolean;

  /** 現在の問題のインデックス。 */
  index: number;
  /** 現在の日本語の質問。 */
  questionJa: string;
  /** 現在の英語の回答（タイピング対象）。 */
  answerEn: string;
  /** 現在の質問に関連する画像パス。 */
  questionImg?: string;

  /** ユーザーが現在入力した文字列。 */
  typed: string;
  /** 各文字が正しく入力されたかを示す真偽値の配列。 */
  correctMap: boolean[];
  /** 正しい入力の総数。 */
  hits: number;
  /** エラー入力の総数。 */
  errors: number;

  /** ヒントが表示されているか。 */
  showHint: boolean;
  /** ヒントの段階（0: なし, 1: 1文字目, 2: 全文）。 */
  hintStep: 0 | 1 | 2;
  /** 現在の学習フェーズ。 */
  learningPhase: LearningPhase;
  /** 現在の問題でミスをしたか。 */
  problemHasMistake: boolean;
  /** 現在の問題でヒントを使用したか。 */
  problemUsedHint: boolean;

  /** プレイヤーの現在のHP。 */
  playerHp: number;
  /** 敵の現在のHP。 */
  enemyHp: number;
  /** プレイヤーの最大HP。 */
  playerMaxHp: number;
  /** 敵の最大HP。 */
  enemyMaxHp: number;

  /** 現在のコンボ数。 */
  combo: number;
  /** 問題の解答回数（周回数）。 */
  playCount: number;
  /** アプリ全体でのヒント使用総回数。 */
  usedHintCount: number;
  /** アプリ全体でのミスをした問題の総数。 */
  mistakeProblemCount: number;
}

/**
 * タイピングエンジンの状態を更新するためのアクション。
 */
export type Action =
  | {
      type: "START";
      payload: {
        now: number;
        playerMaxHp: number;
        enemyMaxHp: number;
        learning: boolean;
        playCount: number;
      };
    }
  | { type: "STOP"; payload: { victory?: boolean } }
  | { type: "FINISH"; payload: { victory: boolean } }
  | {
      type: "LOAD_PAIR";
      payload: { index: number; pair: QAPair; learning: boolean };
    }
  | { type: "TYPE_CHAR"; payload: { key: string; ok: boolean } }
  | { type: "BACKSPACE" }
  | { type: "SET_PHASE"; payload: { phase: LearningPhase; showHint: boolean } }
  | {
      type: "SET_HINT_STEP";
      payload: { step: 0 | 1 | 2; showHint?: boolean; markUsedHint?: boolean };
    }
  | { type: "MARK_USED_HINT" }
  | {
      type: "SYNC_LEARNING_TOGGLE";
      payload: { learning: boolean; learnThenRecall: boolean };
    }
  | { type: "TALLY_QUESTION" }
  | { type: "DAMAGE_PLAYER"; payload: { amount: number } }
  | { type: "DAMAGE_ENEMY"; payload: { amount: number } };

/**
 * バトルアリーナコンポーネントのプロパティ。
 */
export type BattleArenaProps = {
  /** アリーナのDOM要素への参照。 */
  ref: React.RefObject<HTMLDivElement | null>;
  /** 敵キャラクターの画像パス。 */
  enemyImg: string;
  /** 背景画像のパス。 */
  backgroundImg: string;
  /** 敵へのダメージアニメーションのトリガーID。 */
  hurtId: number;
  /** 敵の消滅アニメーションのトリガーID。 */
  vanishId: number;
  /** 敵が消滅した状態か。 */
  vanished: boolean;
  /** 消滅アニメーション完了時のコールバック。 */
  onVanishDone: () => void;
  /** 斬撃アニメーションのトリガーID。 */
  slashId: number;
  /** アリーナ内に表示する子要素。 */
  children?: React.ReactNode;
  /** 質問のテキスト。 */
  questionText: string;
  /** 質問の画像パス。 */
  questionImg: string | undefined;
  /** エンジンの現在の状態。 */
  state: EngineState;
  /** 敵のHPのパーセンテージ（0.0〜1.0）。 */
  enemyHpPct: number;
  /** アリーナのDOM要素そのものの参照。 */
  arenaRef: HTMLDivElement | null;
};

/**
 * ヘッダー制御コンポーネントのプロパティ。
 */
export type HeaderControlsProps = {
  /** エンジンが開始されているか。 */
  started: boolean;
  /** エンジンが終了しているか。 */
  finished: boolean;
  /** 開始ボタンが押されたときのコールバック。 */
  onStart: () => void;
  /** 逃走（エスケープ）ボタンが押されたときのコールバック。 */
  onEscape: () => void;
  /** 設定を開くボタンが押されたときのコールバック。 */
  onOpenSettings: () => void;
  /** 戻るボタンが押されたときのコールバック。 */
  onBack: () => void;
};

/**
 * 学習フェーズ通知コンポーネントのプロパティ。
 */
export type PhaseNoticeProps = {
  /** Learn Then Recallモードが有効か。 */
  learnThenRecall: boolean;
  /** 現在の学習フェーズ。 */
  phase?: "study" | "recall";
};

/**
 * プレイヤーHPバーコンポーネントのプロパティ。
 */
export type PlayerHpBarProps = {
  /** 現在のHP。 */
  current: number;
  /** 最大HP。 */
  max: number;
  /** HPのパーセンテージ（0.0〜1.0）。 */
  pct: number;
};

/**
 * 画像が収まる矩形領域の型。
 */
export type ContainRect = {
  /** X座標。 */
  x: number;
  /** Y座標。 */
  y: number;
  /** 幅。 */
  w: number;
  /** 高さ。 */
  h: number;
};

/**
 * マップ上のクリックポイントコンポーネントのプロパティ。
 */
export type ClickPointProps = {
  /** マップポイントのデータ。 */
  point: MapPoint;
  /** 表示領域の矩形情報。 */
  containRect?: ContainRect;
  /** ツールチップを表示するかどうか。 */
  showTooltip?: boolean;
  /** クリック時のコールバック。 */
  onClick?: () => void;
};

/**
 * タイトルコンポーネントのプロパティ。
 */
export type TitleProps = {
  /** 表示領域の矩形情報。 */
  containRect?: ContainRect;
};

/**
 * 回答パネルコンポーネントのプロパティ。
 */
export type AnswerPanelProps = {
  /** ユーザーが現在入力した文字列。 */
  typed: string;
  /** 各文字の正誤を示す配列。 */
  correctMap: boolean[];
  /** 正しい回答文字列。 */
  answer: string;
  /** ヒントが表示されているか。 */
  showHint: boolean;
  /** エンジンの現在の状態。 */
  state: EngineState;
  /** キー入力処理関数。 */
  inputOnKey: (key: string) => void;
  /** 結果ダイアログが開いているか。 */
  resultOpen: boolean;
  /** タイピングエンジンインスタンス。 */
  engine: EngineLike;
};

/**
 * 回答入力表示コンポーネントのプロパティ。
 */
export type AnswerInputViewProps = {
  /** ユーザーが現在入力した文字列。 */
  typed: string;
  /** 各文字の正誤を示す配列。 */
  correctMap: boolean[];
  /** 正しい回答文字列。 */
  answer: string;
  /** ヒントが表示されているか。 */
  showHint: boolean;
};

/**
 * ダメージアニメーションコンポーネントのプロパティ。
 */
export type DamageMotionProps = {
  /** アリーナのDOM要素への参照。 */
  arenaRef: HTMLDivElement | null;
  /** 斬撃アニメーションのトリガーID。 */
  slashId: number;
  /** ダメージアニメーションのトリガーID。 */
  hurtId: number;
};

/**
 * 敵HPバーコンポーネントのプロパティ。
 */
export type EnemyHpBarProps = {
  /** 現在のHP。 */
  current: number;
  /** 最大HP。 */
  max: number;
  /** HPのパーセンテージ（0.0〜1.0）。 */
  pct: number;
};

/**
 * 敵レイヤーコンポーネントのプロパティ。
 */
export type EnemyLayerProps = {
  /** 背景画像のパス。 */
  backgroundImg: string;
  /** 敵キャラクターの画像パス。 */
  enemyImg: string;
  /** 敵の消滅アニメーションのトリガーID。 */
  vanishId: number;
  /** 敵が消滅した状態か。 */
  vanished: boolean;
  /** 消滅アニメーション完了時のコールバック。 */
  onVanishDone: () => void;
};

/**
 * 質問パネルコンポーネントのプロパティ。
 */
export type QuestionPanelProps = {
  /** 質問のテキスト。 */
  questionText: string;
  /** 質問の画像パス。 */
  questionImg?: string | null;
};

/**
 * タイトルオーバーレイコンポーネントのプロパティ。
 */
export type TitleOverlayProps = {
  /** タイトル画像のソースパス。 */
  src: string;
  /** 表示されているか。 */
  visible: boolean;
  /** アニメーション制御オブジェクト。 */
  animateCtrl: Controls;
};

/**
 * スライドオーバーレイコンポーネントのプロパティ。
 */
export type SlideOverlayProps = {
  /** スライドの方向。 */
  side: "top" | "bottom" | "left" | "right";
  /** オーバーレイ画像のソースパス。 */
  src: string;
  /** 表示されているか。 */
  visible: boolean;
  /** アニメーション制御オブジェクト。 */
  animateCtrl: Controls;
};

/**
 * タイピング文字の正誤を判定する関数の型。
 */
export type JudgeFn = (
  /** 正しい回答文字列。 */
  answer: string,
  /** 現在のカーソル位置（文字インデックス）。 */
  cursor: number,
  /** 入力されたキー。 */
  key: string,
) => { ok: boolean };

/**
 * Howlインスタンス、またはnull。
 */
export type HowlOrNull = Howl | null;

/**
 * サウンド制御オブジェクトの型。
 */
export type SoundCtl = {
  /** BGMを再生する関数。 */
  playBgm: () => void;
  /** BGMを停止する関数。 */
  stopBgm: () => void;
  /** 各種効果音の制御オブジェクト。 */
  sfx: {
    /** 斬撃効果音を再生する関数。 */
    slash: () => void;
    /** パンチ効果音を再生する関数。 */
    punch: () => void;
    /** 敗北効果音を再生する関数。 */
    defeat: () => void;
    /** 逃走効果音を再生する関数。 */
    escape: () => void;
    /** 転倒効果音を再生する関数。 */
    fallDown: () => void;
    /** レベルアップ効果音を再生する関数。 */
    levelUp: () => void;
    /** キー入力効果音を再生する関数。 */
    keyOn: () => void;
  };
};

/**
 * `useHowlerBgm`フックのオプション。
 */
export type useHowlerBgmOpts = {
  /** BGMのソースパス。 */
  src: string;
  /** デフォルトの音量。 */
  defaultVolume?: number;
  /** ループ再生するか。 */
  loop?: boolean;
};

/**
 * シーケンス中のビジュアル要素の表示状態。
 */
export type useSequenceVisuals = {
  /** タイトル画像が表示されているか。 */
  title: boolean;
  /** 上部オーバーレイが表示されているか。 */
  top: boolean;
  /** 下部オーバーレイが表示されているか。 */
  bottom: boolean;
  /** 右部オーバーレイが表示されているか。 */
  right: boolean;
  /** 左部オーバーレイが表示されているか。 */
  left: boolean;
};

/**
 * タイピングページコンポーネントのプロパティ。
 */
export type TypingPageProps = {
  /** 使用する質問と回答のペアの配列。 */
  QA: QAPair[];
  /** ページのタイトル。 */
  title: string;
  /** サウンドが有効かどうか。 */
  sound: boolean | undefined;
};

/**
 * アプリケーションのメインコンポーネントのプロパティ。
 */
export type AppProps = {
  /** 過去に一度アプリをプレイしたことがあるかどうかのフラグ。 */
  played?: boolean;
};

/**
 * ヘッダー領域コンポーネントのプロパティ。
 */
export type HeaderAreaProps = {
  /** 表示するタイトル。 */
  title: string;
  /** タイピングを開始する関数。 */
  start: () => void;
  /** タイピングを停止する関数。 */
  stop: (reason?: "escape" | "user" | "dead" | "victory") => void;
  /** エンジンの現在の状態。 */
  state: EngineState;
  /** BGM再生状態を設定する関数。 */
  setShouldPlay: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  /** 現在の設定オブジェクト。 */
  settings: Settings;
  /** 設定ドロワーを開く関数。 */
  onOpen: () => void;
};

/**
 * マップのタイルデータ。
 */
export type Tile = {
  /** 画像のソースパス。 */
  src: string;
  /** タイルのX座標。 */
  x: number;
  /** タイルのY座標。 */
  y: number;
  /** タイルの幅。 */
  w: number;
  /** タイルの高さ。 */
  h: number;
};
