import type { Story, StoryDefault } from "@ladle/react";
import { Box, Button, HStack, VStack, Code, Separator } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { HeaderArea } from "@/components/typing/HeaderArea/index";
import PageProvider from "@/contexts/PageProvider";

// PageContext から「コンテキスト」と「hooks」を同一モジュールから import
import { useBattle, useSetBattle } from "@/contexts/PageContext";

export default {
  title: "Components/typing/HeaderArea",
} satisfies StoryDefault;

const PlaygroundInner: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const battle = useBattle();
  const setBattle = useSetBattle();
  const [shouldPlay, setShouldPlay] = useState<boolean | undefined>(false);

  const state = useMemo(
    () => ({ started, finished, shouldPlay, battle }),
    [started, shouldPlay, finished, battle],
  );

  const mockSettings = {
    bgm: true,
    sfx: true,
    masterVolume: 0.8,
  } as any;

  const start = () => {
    setStarted(true);
    setFinished(false);
  };

  const stop = (_reason?: "escape") => {
    setFinished(true);
    setStarted(false);
    setShouldPlay(false);
  };

  const onOpen = () => {
    // eslint-disable-next-line no-alert
    alert("設定モーダルを開く想定");
  };

  return (
    // PageContext を提供してから HeaderArea を描画
    <Box p="6">
      <VStack align="stretch" gap="3" mb="4">
        <HStack gap="2" flexWrap="wrap">
          <Button size="sm" onClick={start} disabled={started && !finished}>
            開始 (start)
          </Button>
          <Button
            size="sm"
            onClick={() => stop()}
            disabled={!started || finished}
          >
            終了 (stop)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFinished((v) => !v)}
          >
            finished 切替
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShouldPlay((v) => !v)}
          >
            shouldPlay 切替
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBattle((v) => !v)}
          >
            battle 切替 {String(battle)}
          </Button>
          <Button size="sm" onClick={onOpen}>
            設定を開く (onOpen)
          </Button>
        </HStack>

        <Box fontSize="sm">
          <Code mr="2">started</Code>
          {String(state.started)}
          <Code mx="2">finished</Code>
          {String(state.finished)}
          <Code mx="2">shouldPlay</Code>
          {String(state.shouldPlay)}
          <Code mx="2">battle</Code>
          {String(state.battle)}
        </Box>

        <Separator />
      </VStack>

      <HeaderArea
        title="デモステージ"
        start={start}
        stop={stop as any}
        state={state as any}
        setShouldPlay={setShouldPlay}
        onOpen={onOpen}
        settings={mockSettings}
      />
    </Box>
  );
};

export const Basic: Story = () => (
  <PageProvider>
    <PlaygroundInner />
  </PageProvider>
);
