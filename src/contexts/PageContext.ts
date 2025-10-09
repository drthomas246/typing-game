import { createContext, useContext } from "react";

/**
 * 現在のページ番号を保持するReactコンテキスト。
 * このコンテキストは、アプリケーションの異なる部分で現在のページ状態にアクセスするために使用されます。
 */
export const UserPageContext = createContext<number | undefined>(undefined);
/**
 * ページ番号を更新するための関数を保持するReactコンテキスト。
 * このコンテキストは、アプリケーションの異なる部分でページ状態を更新するために使用されます。
 */
export const UserSetPageContext = createContext<
  React.Dispatch<React.SetStateAction<number>> | undefined
>(undefined);

/**
 * サウンド設定の状態（オン/オフ）を保持するReactコンテキスト。
 * このコンテキストは、アプリケーション全体でサウンドの再生状態にアクセスするために使用されます。
 */
export const UserSoundContext = createContext<boolean | undefined>(undefined);
/**
 * サウンド設定の状態を更新するための関数を保持するReactコンテキスト。
 * このコンテキストは、サウンドのオン/オフ状態を変更する必要があるコンポーネントにディスパッチ関数を提供します。
 */
export const UserSetSoundContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

/**
 * バトルモードの状態（オン/オフ）を保持するReactコンテキスト。
 * このコンテキストは、アプリケーション全体でバトルモード設定にアクセスするために使用されます。
 */
export const UserBattleContext = createContext<boolean | undefined>(undefined);
/**
 * バトルモードの状態を更新するための関数を保持するReactコンテキスト。
 * このコンテキストは、バトルモードのオン/オフ状態を変更する必要があるコンポーネントにディスパッチ関数を提供します。
 */
export const UserSetBattleContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

export const UserSortContext = createContext<boolean | undefined>(undefined);
export const UserSetSortContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

export const UserLevelContext = createContext<number | undefined>(undefined);
export const UserSetLevelContext = createContext<
  React.Dispatch<React.SetStateAction<number>> | undefined
>(undefined);

/**
 * 現在のページ番号を取得する。
 */
export function usePage() {
  const v = useContext(UserPageContext);
  if (v === undefined)
    throw new Error("usePage must be used within <PageProvider>");
  return v;
}
/**
 * ページ番号の更新関数を取得する。
 */
export function useSetPage() {
  const set = useContext(UserSetPageContext);
  if (set === undefined)
    throw new Error("useSetPage must be used within <PageProvider>");
  return set;
}

/**
 * サウンド設定の状態を取得する。
 */
export function useSound() {
  const v = useContext(UserSoundContext);
  if (v === undefined)
    throw new Error("useSound must be used within <PageProvider>");
  return v;
}
/**
 * サウンド設定の更新関数を取得する。
 */
export function useSetSound() {
  const set = useContext(UserSetSoundContext);
  if (set === undefined)
    throw new Error("useSetSound must be used within <PageProvider>");
  return set;
}

/**
 * バトルモードかどうかを取得する。
 */
export function useBattle() {
  const v = useContext(UserBattleContext);
  if (v === undefined)
    throw new Error("useBattle must be used within <PageProvider>");
  return v;
}
/**
 * バトルモードの更新関数を取得する。
 */
export function useSetBattle() {
  const set = useContext(UserSetBattleContext);
  if (set === undefined)
    throw new Error("useSetBattle must be used within <PageProvider>");
  return set;
}

/**
 * 出題順の設定を取得する。
 */
export function useSort() {
  const v = useContext(UserSortContext);
  if (v === undefined)
    throw new Error("useSort must be used within <PageProvider>");
  return v;
}
/**
 * 出題順設定の更新関数を取得する。
 */
export function useSetSort() {
  const set = useContext(UserSetSortContext);
  if (set === undefined)
    throw new Error("useSetSort must be used within <PageProvider>");
  return set;
}

/**
 * プレイヤーレベルを取得する。
 */
export function useLevel() {
  const v = useContext(UserLevelContext);
  if (v === undefined)
    throw new Error("useLevel must be used within <PageProvider>");
  return v;
}
/**
 * プレイヤーレベルの更新関数を取得する。
 */
export function useSetLevel() {
  const set = useContext(UserSetLevelContext);
  if (set === undefined)
    throw new Error("useSetLevel must be used within <PageProvider>");
  return set;
}
