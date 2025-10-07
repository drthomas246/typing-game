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
 * テーマ切り替え用のプロバイダーを提供する。
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
        return (
                <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
        );
}

/**
 * 現在のテーマに合わせたアイコンを返す。
 */
export function ColorModeIcon(props: React.ComponentProps<typeof LuSun>) {
        const { colorMode } = useColorMode();
        const Icon = colorMode === "dark" ? LuMoon : LuSun;
        return <Icon {...props} />;
}

/**
 * テーマをワンクリックで切り替えるボタン。
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
 * ライトモード専用のラッパー要素。
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
 * ダークモード専用のラッパー要素。
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
