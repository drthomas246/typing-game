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
 * タイピングゲームの結果を表示し、再挑戦やダイアログを閉じるアクションを提供するUIコンポーネント。
 *
 * @param {ResultsDialogProps} props - このコンポーネントが受け取るプロパティ。
 * @param {boolean} props.open - ダイアログが開いているかどうかを制御するフラグ。
 * @param {(open: boolean) => void} props.setOpen - ダイアログの開閉状態を更新する関数。
 * @param {() => void} props.onRetry - 「もう一度やる」ボタンがクリックされたときに実行されるコールバック関数。
 * @param {(play: boolean) => void} props.setShouldBgmPlay - BGMの再生状態を制御する関数。
 * @param {object} props.summary - タイピングゲームの結果のサマリーデータ。
 * @param {number} props.summary.timeSec - ゲームにかかった時間（秒）。
 * @param {number} props.summary.usedHintCount - ヒントを使用した問題の数。
 * @param {number} props.summary.mistakeProblemCount - 間違えた問題の数。
 * @param {boolean} props.summary.killedNow - プレイヤーがレベルアップしたかどうかを示すフラグ。
 *
 * @returns {JSX.Element} 結果表示用のダイアログ。
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
                    if (sound) setShouldBgmPlay(true);
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
