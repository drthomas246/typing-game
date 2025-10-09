import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { SlideOverlayProps } from "@/types/index";

const MotionImage = motion(Image);

/**
 * タイトル画面でスライドイン/アウトする視覚的なオーバーレイを描画するコンポーネント。
 * 主にゲームの開始時や場面転換時にアニメーションとして使用されます。
 *
 * @param {SlideOverlayProps} props - このコンポーネントが受け取るプロパティ。
 * @param {'top' | 'bottom' | 'left' | 'right'} props.side - オーバーレイが画面のどの「サイド」に属するかを示し、`zIndex`を決定します。
 * @param {string} props.src - オーバーレイとして表示される画像のURL。
 * @param {boolean} props.visible - オーバーレイを表示するかどうかを制御します。`false`の場合、何もレンダリングされません。
 * @param {import('framer-motion').AnimationControls} props.animateCtrl - `framer-motion`の`AnimationControls`インスタンスで、オーバーレイのアニメーションを制御します。
 * @returns {JSX.Element | null} オーバーレイ画像、または`visible`が`false`の場合は`null`。
 */
export function SlideOverlay({ side, src, visible, animateCtrl }: SlideOverlayProps) {
	if (!visible) return null;
	const zIndex = side === "top" ? 50 : side === "bottom" ? 40 : side === "right" ? 30 : 20;

	return (
		<MotionImage
			src={src}
			alt={side}
			pos="absolute"
			inset="0"
			w="100%"
			h="100%"
			zIndex={zIndex}
			animate={animateCtrl}
			pointerEvents="none"
		/>
	);
}
