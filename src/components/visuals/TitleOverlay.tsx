import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { TitleOverlayProps } from "@/types/index";

const MotionImage = motion(Image);

/**
 * タイトル画面で表示されるアニメーション付きの画像オーバーレイコンポーネント。
 * 主にゲームの開始時など、タイトル画像に動的な効果を与えるために使用されます。
 *
 * @param {object} props - このコンポーネントが受け取るプロパティ。
 * @param {string} props.src - オーバーレイとして表示する画像ファイルのパス。
 * @param {boolean} props.visible - オーバーレイを表示するかどうかを制御するフラグ。`false`の場合、コンポーネントは`null`を返す。
 * @param {import('framer-motion').AnimationControls} props.animateCtrl - `framer-motion`の`AnimationControls`インスタンス。アニメーションを制御するために使用されます。
 * @returns {JSX.Element | null} タイトル画像オーバーレイ、または`visible`が`false`の場合は`null`。
 */
export function TitleOverlay({ src, visible, animateCtrl }: TitleOverlayProps) {
	if (!visible) return null;

	return (
		<MotionImage
			src={src}
			alt="タイトル"
			pos="absolute"
			inset="0"
			w="100%"
			h="100%"
			objectFit="contain"
			zIndex={60}
			animate={animateCtrl}
			initial={{ scale: 0, opacity: 0, display: "block" }}
			pointerEvents="none"
			style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
		/>
	);
}
