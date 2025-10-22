// tests/utils/renderWithProviders.tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  type RenderHookOptions,
  type RenderOptions,
  render,
  renderHook,
} from "@testing-library/react";
import React from "react";
// Mock用の最小Provider（必要に応じて拡張）
import {
  UserBattleContext,
  UserLevelContext,
  UserPageContext,
  UserSetBattleContext,
  UserSetLevelContext,
  UserSetPageContext,
  UserSetSortContext,
  UserSetSoundContext,
  UserSortContext,
  UserSoundContext,
} from "@/contexts/PageContext";
// 本番の実Provider
import PageProvider from "@/contexts/PageProvider";

/** ===== MockPageProvider: P0向けに軽量・決定論的に ===== */
export type MockPageState = {
  page?: number; // ★ 追加（TypingPageは 0 以外でページ本体を描画）
  battle?: boolean;
  level?: number;
  sound?: boolean;
  sort?: any;
};

export const MockPageProvider: React.FC<
  React.PropsWithChildren<{ initial?: MockPageState }>
> = ({ initial, children }) => {
  const [page, setPage] = React.useState<number>(initial?.page ?? 1); // ★ 追加: 1 を既定に
  const [battle, setBattle] = React.useState<boolean>(initial?.battle ?? true);
  const [level, setLevel] = React.useState<number>(initial?.level ?? 1);
  const [sound, setSound] = React.useState<boolean>(initial?.sound ?? true);
  const [sort, setSort] = React.useState<any>(initial?.sort ?? "default");

  return (
    <UserPageContext.Provider value={page}>
      <UserSetPageContext.Provider value={setPage}>
        <UserBattleContext.Provider value={battle}>
          <UserSetBattleContext.Provider value={setBattle}>
            <UserLevelContext.Provider value={level}>
              <UserSetLevelContext.Provider value={setLevel}>
                <UserSoundContext.Provider value={sound}>
                  <UserSetSoundContext.Provider value={setSound}>
                    <UserSortContext.Provider value={sort}>
                      <UserSetSortContext.Provider value={setSort}>
                        {children}
                      </UserSetSortContext.Provider>
                    </UserSortContext.Provider>
                  </UserSetSoundContext.Provider>
                </UserSoundContext.Provider>
              </UserSetLevelContext.Provider>
            </UserLevelContext.Provider>
          </UserSetBattleContext.Provider>
        </UserBattleContext.Provider>
      </UserSetPageContext.Provider>
    </UserPageContext.Provider>
  );
};

/** ===== 実/モックの2系統を用意（UIテスト用のrender） ===== */
export type ProviderMode =
  | { kind: "real" } // PageProvider（実）
  | { kind: "mock"; initial?: MockPageState }; // MockPageProvider（軽量）

export function renderWithProviders(
  ui: React.ReactElement,
  mode: ProviderMode = { kind: "real" },
  options?: Omit<RenderOptions, "wrapper">,
) {
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const inner =
      mode.kind === "real" ? (
        <PageProvider>{children}</PageProvider>
      ) : (
        <MockPageProvider initial={mode.initial}>{children}</MockPageProvider>
      );
    return <ChakraProvider value={defaultSystem}>{inner}</ChakraProvider>;
  };
  return render(ui, { wrapper: Wrapper, ...options });
}

/** ===== Hook向け（既存互換API） ===== */
export function renderHookWithProviders<TProps, TResult>(
  cb: (initialProps: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) {
  // 既存の実装互換：デフォルトは実Provider（PageProvider）
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <PageProvider>{children}</PageProvider>
  );
  return renderHook(cb, { wrapper: Wrapper, ...options });
}

/** ===== Hook向けの“Mock版”も用意（任意） ===== */
export function renderHookWithMockProviders<TProps, TResult>(
  cb: (initialProps: TProps) => TResult,
  initial?: MockPageState,
  options?: RenderHookOptions<TProps>,
) {
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <MockPageProvider initial={initial}>{children}</MockPageProvider>
  );
  return renderHook(cb, { wrapper: Wrapper, ...options });
}
