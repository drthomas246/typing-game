import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps extends ChakraTooltip.RootProps {
	/**
	 * ツールチップの矢印を表示するかどうかを決定します。
	 */
	showArrow?: boolean;
	/**
	 * ツールチップのコンテンツをReact Portalを使用してレンダリングするかどうかを決定します。
	 * デフォルトは`true`です。
	 */
	portalled?: boolean;
	/**
	 * Portalのコンテナとして使用するHTMLElementへの参照です。
	 */
	portalRef?: React.RefObject<HTMLElement>;
	/**
	 * ツールチップ内に表示される主要なコンテンツです。
	 */
	content: React.ReactNode;
	/**
	 * ツールチップのコンテンツコンポーネントに直接渡されるプロパティです。
	 */
	contentProps?: ChakraTooltip.ContentProps;
	/**
	 * ツールチップ機能を無効にするかどうかを決定します。
	 * `true`の場合、ツールチップは表示されず、その子要素が直接レンダリングされます。
	 */
	disabled?: boolean;
}

/**
 * Chakra UIのツールチップ機能を拡張した汎用コンポーネントです。
 * 矢印の表示、Portalでのレンダリングの制御、ツールチップの無効化などの機能を提供します。
 *
 * @param {TooltipProps} props - このコンポーネントが受け取るプロパティ。`TooltipProps`を参照してください。
 * @param {React.Ref<HTMLDivElement>} ref - ツールチップのコンテンツ要素への参照。
 * @returns {JSX.Element | React.ReactNode} ツールチップ、または`disabled`が`true`の場合は子要素。
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
	const {
		showArrow,
		children,
		disabled,
		portalled = true,
		content,
		contentProps,
		portalRef,
		...rest
	} = props;

	if (disabled) return children;

	return (
		<ChakraTooltip.Root {...rest}>
			<ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
			<Portal disabled={!portalled} container={portalRef}>
				<ChakraTooltip.Positioner>
					<ChakraTooltip.Content ref={ref} {...contentProps}>
						{showArrow && (
							<ChakraTooltip.Arrow>
								<ChakraTooltip.ArrowTip />
							</ChakraTooltip.Arrow>
						)}
						{content}
					</ChakraTooltip.Content>
				</ChakraTooltip.Positioner>
			</Portal>
		</ChakraTooltip.Root>
	);
});
