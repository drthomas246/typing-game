import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { SlideOverlayProps } from "@/types/index";

const MotionImage = motion(Image);

/**
 * タイトル画面のスライド演出を描画するオーバーレイ。
 */
export function SlideOverlay({
  side,
  src,
  visible,
  animateCtrl,
}: SlideOverlayProps) {
  if (!visible) return null;
  const zIndex =
    side === "top" ? 50 : side === "bottom" ? 40 : side === "right" ? 30 : 20;

  return (
    <MotionImage
      src={src}
      alt={side}
      pos="absolute"
      inset="0"
      w="100%"
      h="100%"
      // objectFit="contain"
      zIndex={zIndex}
      animate={animateCtrl}
      pointerEvents="none"
    />
  );
}
