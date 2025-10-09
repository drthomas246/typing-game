import { Box, Image } from "@chakra-ui/react";
import type { TitleProps } from "@/types/index";

/**
 * マップ上にタイトル画像を表示するコンポーネント。
 * 親コンポーネントから渡される矩形情報に基づいて、タイトルの位置とサイズを動的に調整します。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.containRect - タイトルを配置するための基準となる矩形。
 *   通常、これはマップビューポートのスケーリングされた寸法と位置を表します。
 *   `x`, `y`, `w` (幅), `h` (高さ) のプロパティを持ちます。
 * @returns レンダリングされたタイトルコンポーネント、または `containRect` が無効な場合は `null`。
 */
export function Title({ containRect }: TitleProps) {
	if (!containRect || containRect.w === 0 || containRect.h === 0) return null;

	const leftPx = containRect.x + 0.8 * containRect.w;
	const topPx = containRect.y;

	return (
		<Box pos="absolute" left={leftPx} top={topPx} w="20%" zIndex={1}>
			<Image src="./images/title/title.png" alt="ことばの魔王とえいごの勇者" />
		</Box>
	);
}
