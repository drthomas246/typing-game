// src/stories/compornents/typing/ResultsDialog.stories.tsx
import type { Story, StoryDefault } from "@ladle/react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Code,
  Separator,
  Heading,
  Text,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { ResultsDialog } from "@/components/typing/ResultsDialog";

// ==== PageContext の最小モック ====
// ResultsDialog は useBattle / useLevel / useSetLevel / useSound を使うため、
// 必要な Context だけ最小限に提供します（Dexie 等に依存しない安定版）。
import {
  UserBattleContext,
  UserLevelContext,
  UserSetLevelContext,
  UserSoundContext,
} from "@/contexts/PageContext";

export default {
  title: "Components/typing/ResultsDialog",
} satisfies StoryDefault;

// Context を一括で提供するモック Provider
const MockGameProvider: React.FC<
  React.PropsWithChildren<{
    battle: boolean;
    level: number;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    sound: boolean;
  }>
> = ({ battle, level, setLevel, sound, children }) => {
  return (
    <UserBattleContext.Provider value={battle}>
      <UserLevelContext.Provider value={level}>
        <UserSetLevelContext.Provider value={setLevel}>
          <UserSoundContext.Provider value={sound}>
            {children}
          </UserSoundContext.Provider>
        </UserSetLevelContext.Provider>
      </UserLevelContext.Provider>
    </UserBattleContext.Provider>
  );
};

// ============ Playground ============
export const Basic: Story = () => {
  // Dialog 開閉
  const [open, setOpen] = useState<boolean>(true);

  // battle / sound のフラグ
  const [battle, setBattle] = useState<boolean>(true);
  const [sound, setSound] = useState<boolean>(true);

  // Level は Context 経由で更新されるため、ここで保持
  const [level, setLevel] = useState<number>(3);

  // Summary（結果データ）
  const [timeSec, setTimeSec] = useState<number>(42);
  const [usedHintCount, setUsedHintCount] = useState<number>(2);
  const [mistakeProblemCount, setMistakeProblemCount] = useState<number>(1);
  const [killedNow, setKilledNow] = useState<boolean>(true);

  // BGM制御（ResultsDialog から setShouldBgmPlay が呼ばれる）
  const [bgmShouldPlay, setBgmShouldPlay] = useState<boolean | undefined>(
    false,
  );

  const summary = useMemo(
    () => ({ timeSec, usedHintCount, mistakeProblemCount, killedNow }),
    [timeSec, usedHintCount, mistakeProblemCount, killedNow],
  );

  const onRetry = () => {
    // 実アプリではゲームを再開する想定
    // ここでは簡易にカウンタをリセットして再オープン
    setMistakeProblemCount(0);
    setUsedHintCount(0);
    setTimeSec(0);
    setOpen(true);
    // eslint-disable-next-line no-console
    console.log("[ResultsDialog] onRetry called");
  };

  return (
    <MockGameProvider
      battle={battle}
      level={level}
      setLevel={setLevel}
      sound={sound}
    >
      <Box p="6">
        <VStack align="stretch" gap="3" mb="4">
          <Heading size="md">Playground</Heading>

          {/* 操作パネル */}
          <HStack gap="2" flexWrap="wrap">
            <Button size="sm" onClick={() => setOpen(true)}>
              ダイアログを開く
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              ダイアログを閉じる
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setBattle((v) => !v)}
            >
              battle 切替: {String(battle)}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSound((v) => !v)}
            >
              sound 切替: {String(sound)}
            </Button>

            <Button
              size="sm"
              onClick={() => setLevel((v) => Math.max(1, v - 1))}
            >
              Lv -1
            </Button>
            <Button size="sm" onClick={() => setLevel((v) => v + 1)}>
              Lv +1
            </Button>

            <Button
              size="sm"
              onClick={() => setTimeSec((v) => Math.max(0, v - 5))}
            >
              timeSec -5
            </Button>
            <Button size="sm" onClick={() => setTimeSec((v) => v + 5)}>
              timeSec +5
            </Button>

            <Button
              size="sm"
              onClick={() => setUsedHintCount((v) => Math.max(0, v - 1))}
            >
              hint -1
            </Button>
            <Button size="sm" onClick={() => setUsedHintCount((v) => v + 1)}>
              hint +1
            </Button>

            <Button
              size="sm"
              onClick={() => setMistakeProblemCount((v) => Math.max(0, v - 1))}
            >
              mistake -1
            </Button>
            <Button
              size="sm"
              onClick={() => setMistakeProblemCount((v) => v + 1)}
            >
              mistake +1
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setKilledNow((v) => !v)}
            >
              killedNow 切替: {String(killedNow)}
            </Button>
          </HStack>

          <Box fontSize="sm">
            <Code mr="2">open</Code>
            {String(open)}
            <Code mx="2">battle</Code>
            {String(battle)}
            <Code mx="2">sound</Code>
            {String(sound)}
            <Code mx="2">level</Code>
            {level}
            <Code mx="2">timeSec</Code>
            {timeSec}
            <Code mx="2">usedHintCount</Code>
            {usedHintCount}
            <Code mx="2">mistakeProblemCount</Code>
            {mistakeProblemCount}
            <Code mx="2">killedNow</Code>
            {String(killedNow)}
            <Code mx="2">bgmShouldPlay</Code>
            {String(bgmShouldPlay)}
          </Box>

          <Separator />
          <Text fontSize="sm" opacity={0.8}>
            ・battle=false の場合は「ヒントを使った問題数」が表示されます。
            <br />
            ・killedNow=true の場合は「レベルアップ (Lv →
            Lv+1)」が表示され、閉じる時に useSetLevel によりレベルが+1されます。
          </Text>
        </VStack>

        {/* 被検コンポーネント */}
        <ResultsDialog
          open={open}
          setOpen={setOpen}
          onRetry={onRetry}
          setShouldBgmPlay={setBgmShouldPlay}
          summary={summary}
        />
      </Box>
    </MockGameProvider>
  );
};
