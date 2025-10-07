import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ColorModeProviderProps } from "@/types/index";
import { ColorModeProvider } from "./color-mode";

/**
 * Chakra UI とテーマ設定をまとめて提供するラッパー。
 */
export function Provider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider {...props} />
		</ChakraProvider>
	);
}
