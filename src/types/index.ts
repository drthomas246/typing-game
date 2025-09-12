import type {
  Tooltip as ChakraTooltip,
  IconButtonProps,
} from "@chakra-ui/react";
import { useAnimation } from "framer-motion";
import type { ThemeProviderProps } from "next-themes";

export type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

export type ColorModeProviderProps = ThemeProviderProps;

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export type InputCaptureProps = {
  onKey: (ch: string, e: KeyboardEvent) => void;
  enabled?: boolean;
  handleEnter?: boolean;
  handleBackspace?: boolean;
  handleSpace?: boolean;
  handleTab?: boolean;
};

export type ResultsDialogProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onRetry: () => void;
  setShouldBgmPlay: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  summary: {
    /** 実測プレイ時間（秒） */
    timeSec: number;
    /** ヒント（Tab/学習ヒントなど）を使った問題の個数 */
    usedHintCount: number;
    /** 1問内で一度でもミスがあった問題の個数 */
    mistakeProblemCount: number;
  };
};

export interface QAPair {
  ja: string;
  en: string;
  img?: string;
}

export type JudgeResult = { ok: boolean; expected: string; received: string };

/** 発話オプション（useSpeech.ts 用） */
export type SpeakOpts = {
  lang?: string;
  rate?: number;
  pitch?: number;
  voiceHint?: string;
  /** 同一テキストの短時間重複呼び出しを抑止する間隔(ms)。既定 500ms */
  dedupeMs?: number;
  /** デデュープを無効化（常に発話）したい時は true */
  noDedupe?: boolean;
};

/**
 * 唯一のオプション型
 * - 経過時間のみ運用; 制限時間関連は含めない。
 */
export interface EngineOptions {
  tickMs?: number;

  battleMode?: boolean;
  playerMaxHp?: number;
  enemyMaxHp?: number;
  damagePerMiss?: number;
  damagePerSentence?: number;

  sound?: boolean;

  bgm?: boolean;
  bgmSrc?: string;
  bgmVolume?: number;

  sfx?: boolean;
  sfxVolume?: number;
  sfxSlashSrc?: string;
  sfxPunchSrc?: string;
  sfxDefeatSrc?: string;
  sfxEscapeSrc?: string;
  sfxFallDownSrc?: string;

  learnThenRecall?: boolean;

  randomOrder?: boolean;
  seed?: number;
  damagePerHit?: number;
  learningMode?: boolean;
}

import type { useTypingEngine } from "@/hooks/typingEngine/useTypingEngine";
export type EngineLike = ReturnType<typeof useTypingEngine>;

export type Settings = {
  language: string;
  learnThenRecall: boolean;
  orderMode: "random" | "sequential";
};

export type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onChange: (s: Settings) => void;
  engine?: EngineLike;
};

export type DecodableImage = HTMLImageElement & {
  decode?: () => Promise<void>;
};

export type HowlerWithCtx = typeof Howler & { ctx?: AudioContext };

export type Controls = ReturnType<typeof useAnimation>;

export type MapPoint = {
  id: number;
  x: number;
  y: number;
  title: string;
  QA: QAPair[];
};

export type LearningPhase = "study" | "recall";

export interface EngineState {
  started: boolean;
  finished: boolean;
  startAt?: number;
  victory?: boolean;

  index: number;
  questionJa: string;
  answerEn: string;
  questionImg?: string;

  typed: string;
  correctMap: boolean[];
  hits: number;
  errors: number;

  showHint: boolean;
  hintStep: 0 | 1 | 2;
  learningPhase: LearningPhase;
  problemHasMistake: boolean;
  problemUsedHint: boolean;

  playerHp: number;
  enemyHp: number;
  playerMaxHp: number;
  enemyMaxHp: number;

  combo: number;
  playCount: number;
  usedHintCount: number;
  mistakeProblemCount: number;
}

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

export type BattleArenaProps = {
  ref: React.RefObject<HTMLDivElement | null>;
  enemyImg: string;
  backgroundImg: string;
  hurtId: number;
  vanishId: number;
  vanished: boolean;
  onVanishDone: () => void;
  slashId: number;
  children?: React.ReactNode;
  questionText: string;
  questionImg: string | undefined;
  state: EngineState;
  enemyHpPct: number;
  arenaRef: HTMLDivElement | null;
};

export type HeaderControlsProps = {
  started: boolean;
  finished: boolean;
  onStart: () => void;
  onEscape: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
};

export type PhaseNoticeProps = {
  learnThenRecall: boolean;
  phase?: "study" | "recall";
};

export type PlayerHpBarProps = {
  current: number;
  max: number;
  pct: number;
};

export type ContainRect = { x: number; y: number; w: number; h: number };

export type ClickPointProps = {
  point: MapPoint;
  containRect?: ContainRect;
  showTooltip?: boolean;
  onClick?: () => void;
};

export type TitleProps = {
  containRect?: ContainRect;
};

export type AnswerPanelProps = {
  typed: string;
  correctMap: boolean[];
  answer: string;
  showHint: boolean;
  state: EngineState;
  inputOnKey: (key: string) => void;
  resultOpen: boolean;
  engine: EngineLike;
};

export type AnswerInputViewProps = {
  typed: string;
  correctMap: boolean[];
  answer: string;
  showHint: boolean;
};

export type DamageMotionProps = {
  arenaRef: HTMLDivElement | null;
  slashId: number;
  hurtId: number;
};

export type EnemyHpBarProps = {
  current: number;
  max: number;
  pct: number;
};

export type EnemyLayerProps = {
  backgroundImg: string;
  enemyImg: string;
  vanishId: number;
  vanished: boolean;
  onVanishDone: () => void;
};

export type QuestionPanelProps = {
  questionText: string;
  questionImg?: string | null;
};

export type TitleOverlayProps = {
  src: string;
  visible: boolean;
  animateCtrl: Controls;
};

export type SlideOverlayProps = {
  side: "top" | "bottom" | "left" | "right";
  src: string;
  visible: boolean;
  animateCtrl: Controls;
};

export type JudgeFn = (
  answer: string,
  cursor: number,
  key: string,
) => { ok: boolean };

export type HowlOrNull = Howl | null;

export type SoundCtl = {
  playBgm: () => void;
  stopBgm: () => void;
  sfx: {
    slash: () => void;
    punch: () => void;
    defeat: () => void;
    escape: () => void;
    fallDown: () => void;
  };
};

export type useHowlerBgmOpts = {
  src: string;
  defaultVolume?: number;
  loop?: boolean;
};

export type useSequenceVisuals = {
  title: boolean;
  top: boolean;
  bottom: boolean;
  right: boolean;
  left: boolean;
};

export type TypingPageProps = {
  QA: QAPair[];
  title: string;
  sound: boolean | undefined;
};

export type AppProps = {
  played?: boolean;
};

export type HeaderAreaProps = {
  title: string;
  start: () => void;
  stop: (reason?: "escape" | "user" | "dead" | "victory") => void;
  state: EngineState;
  setShouldPlay: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  settings: Settings;
  onOpen: () => void;
};
