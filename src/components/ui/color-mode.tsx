import type { SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import type {
  ColorModeButtonProps,
  ColorModeProviderProps,
} from "@/types/index";
import { useColorMode } from "./use-color-mode";

/**
 * アプリケーション全体でカラーモード（ライトモード/ダークモード）を管理するためのプロバイダーコンポーネントです。
 * `next-themes`ライブラリの`ThemeProvider`を利用しており、HTMLの`class`属性を介してテーマを切り替えます。
 * トランジションを無効にして、テーマ切り替え時のちらつきを防ぎます。
 *
 * @param {ColorModeProviderProps} props - このコンポーネントが受け取るプロパティ。`next-themes`の`ThemeProvider`に渡されます。
 * @returns {JSX.Element} テーマプロバイダーのラッパーコンポーネント。
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

/**
 * 現在のカラーモード（ライトまたはダーク）に基づいて、適切なアイコン（太陽または月）を表示するコンポーネントです。
 * `useColorMode`フックを使用して現在のカラーモードを検出し、それに応じて`LuSun`または`LuMoon`アイコンをレンダリングします。
 *
 * @param {React.ComponentProps<typeof LuSun>} props - アイコンコンポーネントに渡されるプロパティ。例えば、`size`など。
 * @returns {JSX.Element} 現在のカラーモードに対応するアイコンコンポーネント。
 */
export function ColorModeIcon(props: React.ComponentProps<typeof LuSun>) {
  const { colorMode } = useColorMode();
  const Icon = colorMode === "dark" ? LuMoon : LuSun;
  return <Icon {...props} />;
}

/**

 * カラーモードをライトとダークの間で切り替えるためのボタンコンポーネントです。
 * `ClientOnly`でラップされており、サーバーサイドレンダリング時にハイドレーションエラーが発生しないようにします。
 * クリックすると`useColorMode`フックの`toggleColorMode`を呼び出します。
 *
 * @param {ColorModeButtonProps} props - このコンポーネントが受け取るプロパティ。`IconButton`に渡されます。\n * @param {React.Ref<HTMLButtonElement>} ref - ボタン要素への参照。
 * @returns {JSX.Element} カラーモード切り替えボタン。
 */
export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
      >
        <ColorModeIcon size={20} />
      </IconButton>
    </ClientOnly>
  );
});

/**
 * アプリケーションを強制的にライトモードでレンダリングするためのラッパーコンポーネントです。
 * `Span`要素として機能し、`chakra-theme light`クラスを適用します。
 * 特定のUI要素を常にライトモードで表示したい場合に使用します。
 *
 * @param {SpanProps} props - このコンポーネントが受け取るプロパティ。`Span`コンポーネントに渡されます。
 * @param {React.Ref<HTMLSpanElement>} ref - `Span`要素への参照。
 * @returns {JSX.Element} ライトモード専用のラッパー要素。
 */
export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

/**
 * アプリケーションを強制的にダークモードでレンダリングするためのラッパーコンポーネントです。
 * `Span`要素として機能し、`chakra-theme dark`クラスを適用します。
 * 特定のUI要素を常にダークモードで表示したい場合に使用します。
 *
 * @param {SpanProps} props - このコンポーネントが受け取るプロパティ。`Span`コンポーネントに渡されます。
 * @param {React.Ref<HTMLSpanElement>} ref - `Span`要素への参照。
 * @returns {JSX.Element} ダークモード専用のラッパー要素。
 */
export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  },
);
