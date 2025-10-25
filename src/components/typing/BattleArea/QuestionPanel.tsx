import { AspectRatio, Box, Image, Skeleton, Text } from "@chakra-ui/react";
import type { QuestionPanelProps } from "@/types/index";

/**
 * タイピングゲームの問題文と、それに関連する画像を表示するためのパネルコンポーネント。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.questionText - 表示する問題文のテキスト。
 * @param props.questionImg - 表示する画像のソースURL。画像がない場合は `null` または `undefined` を想定。
 * @returns レンダリングされた問題パネルコンポーネント。
 */
export function QuestionPanel({
  questionText,
  questionImg,
}: QuestionPanelProps) {
  return (
    <Box w="450px">
      <Box rounded="lg" borderWidth="1px" p="3" bg="gray.subtle">
        <Text fontSize={{ base: "lg", md: "xl" }} color="fg">
          {questionText}
        </Text>
      </Box>

      <Box mt="16px">
        <AspectRatio ratio={1 / 1} w="200px" mx="auto">
          {questionImg ? (
            <Image
              src={questionImg}
              alt={questionText || "question image"}
              objectFit="contain"
              rounded="lg"
              borderWidth="1px"
              bg="white"
              p="2"
            />
          ) : (
            <Skeleton rounded="lg" />
          )}
        </AspectRatio>
      </Box>
    </Box>
  );
}
