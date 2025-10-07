import {
  Box,
  Button,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Stat,
} from "@chakra-ui/react";
import {
  useBattle,
  useLevel,
  useSetLevel,
  useSound,
} from "@/contexts/PageContext";
import type { ResultsDialogProps } from "@/types/index";

/**
 * タイピング結果を表示し再挑戦を促すダイアログ。
 */
export default function ResultsDialog({
  open,
  setOpen,
  onRetry,
  setShouldBgmPlay,
  summary,
}: ResultsDialogProps) {
  const level = useLevel();
  const setLevel = useSetLevel();
  const sound = useSound();
  const battle = useBattle();
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="sm"
      placement="center"
      onExitComplete={() => {
        if (summary.killedNow) setLevel(level + 1);
        setOpen(false);
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl">
            <Dialog.Header>
              <Dialog.Title>けっか発表</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <HStack gap="6" wrap="wrap">
                <Stat.Root>
                  <Stat.Label>時間</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    {summary.timeSec}s
                  </Stat.ValueText>
                </Stat.Root>
                {!battle && (
                  <Stat.Root>
                    <Stat.Label>ヒントを使った問題数</Stat.Label>
                    <Stat.ValueText fontSize="2xl">
                      {summary.usedHintCount}
                    </Stat.ValueText>
                  </Stat.Root>
                )}

                <Stat.Root>
                  <Stat.Label>まちがえた問題数</Stat.Label>
                  <Stat.ValueText fontSize="2xl">
                    {summary.mistakeProblemCount}
                  </Stat.ValueText>
                </Stat.Root>
              </HStack>
              {summary.killedNow && (
                <Box>
                  レベルが{level}から{level + 1}に上がった
                </Box>
              )}
            </Dialog.Body>

            <Dialog.Footer gap="2">
              <Button
                colorPalette="blue"
                onClick={() => {
                  if (sound) setShouldBgmPlay(false);
                  onRetry();
                }}
              >
                もう一度やる
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (sound) setShouldBgmPlay(true); // waitScreen.mp3 を再生
                  }}
                >
                  とじる
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
