import { useTheme } from "next-themes";
import type { ColorMode, UseColorModeReturn } from "@/types/index";

/**
 * カラーモードの状態と切り替え関数を提供する。
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
 * カラーモードに応じた値を返すユーティリティ。
 */
export function useColorModeValue<T>(light: T, dark: T) {
        const { colorMode } = useColorMode();
        return colorMode === "dark" ? dark : light;
}
