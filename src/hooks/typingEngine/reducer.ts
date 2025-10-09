import type { Action, EngineOptions, EngineState } from "@/types/index";

/**
 * 数値を指定された最小値と最大値の範囲内にクランプ（制限）するユーティリティ関数。
 *
 * @param {number} v - クランプする数値。
 * @param {number} lo - 最小値（下限）。
 * @param {number} hi - 最大値（上限）。
 * @returns {number} 最小値と最大値の間にクランプされた数値。
 */
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * タイピングエンジンの初期状態を生成する関数。
 * ゲーム開始時やリセット時に呼び出され、プレイヤーや敵のHP、タイピングの進捗、設定などを初期化します。
 *
 * @param {EngineOptions} opts - エンジンの初期化オプション。
 * @param {number} [opts.playerMaxHp=100] - プレイヤーの最大HP。1未満の場合は1として扱われる。
 * @param {number} [opts.enemyMaxHp=100] - 敵の最大HP。1未満の場合は1として扱われる。
 * @param {boolean} [opts.learningMode=false] - 学習モードかどうか。`showHint`と`problemUsedHint`の初期値に影響する。
 * @returns {EngineState} 初期化されたタイピングエンジンの状態オブジェクト。
 */
export function initialState(opts: EngineOptions): EngineState {
  const playerMaxHp = Math.max(1, opts.playerMaxHp ?? 100);
  const enemyMaxHp = Math.max(1, opts.enemyMaxHp ?? 100);
  const learning = !!opts.learningMode;

  return {
    started: false,
    finished: false,
    index: 0,
    questionJa: "",
    answerEn: "",
    questionImg: undefined,

    typed: "",
    correctMap: [],
    hits: 0,
    errors: 0,

    showHint: learning,
    hintStep: 0,
    learningPhase: "study",
    problemHasMistake: false,
    problemUsedHint: learning,

    playerHp: playerMaxHp,
    enemyHp: enemyMaxHp,
    playerMaxHp,
    enemyMaxHp,

    combo: 0,
    playCount: 0,
    usedHintCount: 0,
    mistakeProblemCount: 0,
  };
}

/**
 * タイピングエンジンの状態遷移を扱うリデューサー関数。
 * 現在の状態 (`EngineState`) とディスパッチされたアクション (`Action`) を受け取り、
 * 新しい状態を返します。
 *
 * @param {EngineState} s - 現在のタイピングエンジンの状態。
 * @param {Action} a - ディスパッチされたアクションオブジェクト。
 * @returns {EngineState} 更新されたタイピングエンジンの状態。
 */
export function reducer(s: EngineState, a: Action): EngineState {
  switch (a.type) {
    /**
     * ゲームを開始し、初期状態にリセットするアクション。
     * プレイヤーや敵のHP、学習モード、開始時刻などを設定します。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {number} payload.now - ゲーム開始時のタイムスタンプ。
     * @param {number} payload.playerMaxHp - プレイヤーの最大HP。
     * @param {number} payload.enemyMaxHp - 敵の最大HP。
     * @param {boolean} payload.learning - 学習モードかどうか。
     * @param {number} payload.playCount - 現在のプレイ回数。
     */
    case "START": {
      const { now, playerMaxHp, enemyMaxHp, learning, playCount } = a.payload;
      return {
        ...initialState({
          playerMaxHp,
          enemyMaxHp,
          learningMode: learning,
        }),
        started: true,
        finished: false,
        startAt: now,
        playCount,
        learningPhase: learning ? "study" : "recall",
        showHint: learning,
        hintStep: 0,
      };
    }

    /**
     * ゲームを停止するアクション。
     * 既に終了している場合は状態を変更しません。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {boolean} payload.victory - ゲームの勝敗（`true`で勝利）。
     */
    case "STOP": {
      if (s.finished) return s;
      return { ...s, finished: true, victory: a.payload.victory };
    }

    /**
     * ゲームを完全に終了するアクション。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {boolean} payload.victory - ゲームの勝敗（`true`で勝利）。
     */
    case "FINISH": {
      return { ...s, finished: true, victory: a.payload.victory };
    }

    /**
     * 新しい問題ペアをロードするアクション。
     * 現在の問題インデックス、日本語の質問、英語の答え、画像などを更新し、
     * タイピング入力やヒントの状態をリセットします。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {number} payload.index - ロードする問題のインデックス。
     * @param {QAPair} payload.pair - ロードする問題のQAPairオブジェクト。
     * @param {boolean} payload.learning - 学習モードかどうか。
     */
    case "LOAD_PAIR": {
      const { index, pair, learning } = a.payload;
      return {
        ...s,
        index,
        questionJa: pair.ja,
        answerEn: pair.en,
        questionImg: pair.img,
        typed: "",
        correctMap: [],
        showHint: learning,
        problemHasMistake: false,
        problemUsedHint: learning,
        hintStep: 0,
        learningPhase: "study",
      };
    }

    /**
     * 文字がタイプされたときに状態を更新するアクション。
     * タイプされた文字、正誤マップ、ヒット数、エラー数、問題のミステイク状態を更新します。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {string} payload.key - タイプされた文字。
     * @param {boolean} payload.ok - タイプされた文字が正しかったかどうか。
     */
    case "TYPE_CHAR": {
      const ok = a.payload.ok;
      return {
        ...s,
        typed: s.typed + a.payload.key,
        correctMap: [...s.correctMap, ok],
        hits: s.hits + (ok ? 1 : 0),
        errors: s.errors + (ok ? 0 : 1),
        problemHasMistake: s.problemHasMistake || !ok,
      };
    }

    /**
     * Backspaceキーが押されたときに状態を更新するアクション。
     * タイプされた文字列と正誤マップの最後の文字を削除します。
     */
    case "BACKSPACE": {
      if (s.typed.length === 0) return s;
      return {
        ...s,
        typed: s.typed.slice(0, -1),
        correctMap: s.correctMap.slice(0, -1),
      };
    }

    /**
     * 学習フェーズ（study/recall）を設定するアクション。
     * ヒントの表示状態も更新し、現在のタイピング入力をリセットします。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {\"study\" | \"recall\"} payload.phase - 設定する学習フェーズ。
     * @param {boolean} [payload.showHint] - ヒントを表示するかどうか（省略可能）。
     */
    case "SET_PHASE": {
      const { phase, showHint } = a.payload as {
        phase: "study" | "recall";
        showHint?: boolean;
      };
      const nextShowHint = showHint ?? phase === "study";
      return {
        ...s,
        learningPhase: phase,
        showHint: nextShowHint,
        typed: "",
        correctMap: [],
        hintStep: 0,
      };
    }

    /**
     * ヒントのステップを設定するアクション。
     * ヒントの表示状態やヒントの使用済みフラグも更新します。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {number} payload.step - 設定するヒントのステップ。
     * @param {boolean} [payload.showHint] - ヒントを表示するかどうか（省略可能）。
     * @param {boolean} [payload.markUsedHint] - ヒント使用済みとしてマークするかどうか（省略可能）。
     */
    case "SET_HINT_STEP": {
      const { step, showHint, markUsedHint } = a.payload;
      return {
        ...s,
        hintStep: step,
        showHint: showHint ?? s.showHint,
        problemUsedHint: markUsedHint ? true : s.problemUsedHint,
      };
    }

    /**
     * 現在の問題でヒントが使用されたとマークするアクション。
     */
    case "MARK_USED_HINT": {
      return { ...s, problemUsedHint: true };
    }

    /**
     * 学習モードの切り替えを同期するアクション。
     * `learning`と`learnThenRecall`の設定に基づいてヒントの表示状態を調整します。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {boolean} payload.learning - 現在が学習モードかどうか。
     * @param {boolean} payload.learnThenRecall - 「練習→ふく習→次の問題」モードが有効かどうか。
     */
    case "SYNC_LEARNING_TOGGLE": {
      const { learning, learnThenRecall } = a.payload;

      const baseShow = learning
        ? !learnThenRecall || s.learningPhase === "study"
        : false;

      const showHint = s.hintStep === 2 ? true : baseShow;

      return {
        ...s,
        showHint,

        problemUsedHint: s.problemUsedHint || (showHint && s.hintStep === 2),
      };
    }

    /**
     * 問題の結果を集計するアクション。
     * ヒント使用回数、間違い問題数、コンボ数を更新します。
     */
    case "TALLY_QUESTION": {
      const addHint = s.problemUsedHint ? 1 : 0;
      const addMist = s.problemHasMistake ? 1 : 0;
      const disqualified = s.problemUsedHint || s.problemHasMistake;
      const newCombo = disqualified ? 0 : s.combo + 1;
      return {
        ...s,
        usedHintCount: s.usedHintCount + addHint,
        mistakeProblemCount: s.mistakeProblemCount + addMist,
        combo: newCombo,
      };
    }

    /**
     * プレイヤーにダメージを与えるアクション。
     * プレイヤーのHPを減少させ、HPが0になった場合はゲーム終了と判定します。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {number} payload.amount - 与えるダメージ量。
     */
    case "DAMAGE_PLAYER": {
      const playerHp = clamp(s.playerHp - a.payload.amount, 0, s.playerMaxHp);
      const finished = playerHp <= 0 || s.enemyHp <= 0;
      return {
        ...s,
        playerHp,
        finished: finished ? true : s.finished,
        victory: finished ? (s.enemyHp > 0 ? false : s.victory) : s.victory,
      };
    }

    /**
     * 敵にダメージを与えるアクション。
     * 敵のHPを減少させ、HPが0になった場合はゲーム終了と判定します。
     *
     * @param {object} payload - アクションのペイロード。
     * @param {number} payload.amount - 与えるダメージ量。
     */
    case "DAMAGE_ENEMY": {
      const enemyHp = clamp(s.enemyHp - a.payload.amount, 0, s.enemyMaxHp);
      const finished = s.playerHp <= 0 || enemyHp <= 0;
      return {
        ...s,
        enemyHp,
        finished: finished ? true : s.finished,
        victory: finished ? enemyHp <= 0 && s.playerHp > 0 : s.victory,
      };
    }

    default:
      return s;
  }
}
