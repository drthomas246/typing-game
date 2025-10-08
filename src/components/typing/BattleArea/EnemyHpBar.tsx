import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import type { EnemyHpBarProps } from "@/types/index";

/**
 * 敵のHP（ヒットポイント）を表示するためのUIコンポーネント。
 * HPゲージ、ラベル、および現在のHP/最大HPの数値を表示します。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.current - 現在のHP。数値表示に使用されます。
 * @param props.max - 最大HP。数値表示に使用されます。
 * @param props.pct - 現在のHPの割合（パーセンテージ）。HPゲージの幅を決定するために使用されます。
 * @returns レンダリングされた敵のHPバー。
 */
export default function EnemyHpBar({ current, max, pct }: EnemyHpBarProps) {
  return (
    <HStack gap="3" align="center">
      <Badge colorPalette="purple" variant="solid">
        てきのHP
      </Badge>
      <Box
        flex="1"
        h="18px"
        rounded="full"
        bg="blackAlpha.200"
        overflow="hidden"
      >
        <Box h="full" w={`${pct}%`} bg="purple.500" />
      </Box>
      <Text w="96px" textAlign="right">
        {current}/{max}
      </Text>
    </HStack>
  );
}
