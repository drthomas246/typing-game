import { Box, Image } from "@chakra-ui/react";
import type { TitleProps } from "@/types/index";

/**
 * マップ上にタイトル画像を表示する。
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
