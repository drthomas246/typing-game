import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ColorModeProviderProps } from "@/types/index";
import { ColorModeProvider } from "./color-mode";

/**
 * Chakra UIのスタイリングシステムとカラーモード管理プロバイダーをまとめて提供するルートプロバイダーコンポーネント。
 * アプリケーション全体でChakra UIの機能とテーマ切り替え機能を利用可能にする。
 *
 * @param {ColorModeProviderProps} props - このコンポーネントが受け取るプロパティ。主に`ColorModeProvider`に渡される。
 * @param {React.ReactNode} props.children - プロバイダーがラップする子要素。
 *
 * @returns {JSX.Element} Chakra UIとカラーモードプロバイダーが適用された要素。
 */
export function Provider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider {...props} />
		</ChakraProvider>
	);
}
