import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import { useLevel } from "@/contexts/PageContext";
import type { PlayerHpBarProps } from "@/types/index";

/**
 * プレイヤーのレベルとHPを表示するバーコンポーネント。
 *
 * @param {PlayerHpBarProps} props - コンポーネントのプロパティ
 * @param {number} props.current - 現在のHP
 * @param {number} props.max - 最大HP
 * @param {number} props.pct - HPの割合（%）
 * @returns {JSX.Element} プレイヤーのHPバー
 */
export default function PlayerHpBar({ current, max, pct }: PlayerHpBarProps) {
  const level = useLevel();
  return (
    <HStack gap="3" align="center" h="24px">
      <Badge colorPalette="blue" variant="solid">
        あなたのLv
      </Badge>
      <Text w="2em" textAlign="left">
        {level}
      </Text>
      <Badge colorPalette="blue" variant="solid">
        あなたのHP
      </Badge>
      <Box
        flex="1"
        h="18px"
        rounded="full"
        bg="blackAlpha.200"
        overflow="hidden"
      >
        <Box h="full" w={`${pct}%`} bg="blue.500" />
      </Box>
      <Text w="96px" textAlign="right">
        {current}/{max}
      </Text>
    </HStack>
  );
}
