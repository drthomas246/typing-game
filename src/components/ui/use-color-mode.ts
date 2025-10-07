import { useTheme } from "next-themes";
import type { ColorMode, UseColorModeReturn } from "@/types/index";

/**
 * 現在のカラーモード（ライトまたはダーク）とその切り替え機能を提供するカスタムフックです。
 * `next-themes`ライブラリの`useTheme`を利用して、解決されたテーマと強制されたテーマを統合します。
 *
 * @returns {UseColorModeReturn} カラーモードの状態、カラーモードを設定する関数、およびカラーモードをトグルする関数を含むオブジェクト。
 * @property {ColorMode} colorMode - 現在のカラーモード（'light'または'dark'）。
 * @property {(mode: ColorMode) => void} setColorMode - 指定されたカラーモードに設定する関数。
 * @property {() => void} toggleColorMode - 現在のカラーモードを反転させる関数。
 */
export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = (forcedTheme || resolvedTheme) as ColorMode;

  const setColorMode = (mode: ColorMode) => setTheme(mode);
  const toggleColorMode = () => {
    setTheme(colorMode === "dark" ? "light" : "dark");
  };

  return { colorMode, setColorMode, toggleColorMode };
}

/**
 * カラーモードに応じて異なる値を返すユーティリティフックです。
 * UI要素のスタイリングなどで、ライトモードとダークモードで異なる値を適用したい場合に便利です。
 *
 * @template T - 返される値の型。
 * @param {T} light - ライトモード時に返す値。
 * @param {T} dark - ダークモード時に返す値。
 * @returns {T} 現在のカラーモードに対応する値。
 */
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}
