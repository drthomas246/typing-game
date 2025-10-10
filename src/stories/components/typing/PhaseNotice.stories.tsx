// src/stories/compornents/PhaseNoticeArea/PhaseNotice.stories.tsx
import type { Story, StoryDefault } from "@ladle/react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Code,
  Separator,
  Heading,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

// ★ 実プロジェクトの配置に合わせてインポートを調整してください
//   例） "@/components/typing/PhaseNoticeArea/PhaseNotice" 等
import PhaseNotice from "@/components/typing/PhaseNoticeArea/PhaseNotice";

// useBattle が参照するコンテキストを最小限モック（Dexie依存を避ける）
import { UserBattleContext } from "@/contexts/PageContext";

export default {
  title: "Components/typing/PhaseNoticeArea/PhaseNotice",
} satisfies StoryDefault;

/** Story 専用：battle を useState で直管理する最小 Provider */
const MockBattleProvider: React.FC<
  React.PropsWithChildren<{ initial?: boolean }>
> = ({ initial = true, children }) => {
  const [battle] = useState<boolean>(initial);
  return (
    <UserBattleContext.Provider value={battle}>
      {children}
    </UserBattleContext.Provider>
  );
};

// ========== Playground ==========
export const Basic: Story = () => {
  const [learnThenRecall, setLearnThenRecall] = useState<boolean>(true);
  const [phase, setPhase] = useState<"study" | "recall">("study");
  const [battleOn, setBattleOn] = useState<boolean>(true);

  const view = useMemo(
    () => ({ learnThenRecall, phase, battleOn }),
    [learnThenRecall, phase, battleOn],
  );

  return (
    <MockBattleProvider initial={battleOn}>
      <Box p="6">
        <VStack align="stretch" gap="3" mb="4">
          <HStack gap="2" flexWrap="wrap">
            <Button size="sm" onClick={() => setBattleOn((v) => !v)}>
              battle 切替: {String(battleOn)}
            </Button>
            <Button size="sm" onClick={() => setLearnThenRecall((v) => !v)}>
              learnThenRecall 切替: {String(learnThenRecall)}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setPhase((p) => (p === "study" ? "recall" : "study"))
              }
            >
              phase 切替: {phase}
            </Button>
          </HStack>

          <Box fontSize="sm">
            <Code mr="2">battle</Code>
            {String(view.battleOn)}
            <Code mx="2">learnThenRecall</Code>
            {String(view.learnThenRecall)}
            <Code mx="2">phase</Code>
            {view.phase}
          </Box>

          <Separator />
        </VStack>

        <PhaseNotice learnThenRecall={learnThenRecall} phase={phase} />
      </Box>
    </MockBattleProvider>
  );
};

// ========== Matrix（主要パターン俯瞰） ==========
export const Matrix: Story = () => {
  const cell = (
    battle: boolean,
    learnThenRecall: boolean,
    phase: "study" | "recall",
    label: string,
  ) => (
    <MockBattleProvider initial={battle} key={label}>
      <Box p="4" borderWidth="1px" rounded="md" minW="360px">
        <Heading size="sm" mb="2">
          {label}
        </Heading>
        <PhaseNotice learnThenRecall={learnThenRecall} phase={phase} />
        <Box fontSize="xs" mt="2">
          <Code mr="2">battle</Code>
          {String(battle)}
          <Code mx="2">learnThenRecall</Code>
          {String(learnThenRecall)}
          <Code mx="2">phase</Code>
          {phase}
        </Box>
      </Box>
    </MockBattleProvider>
  );

  return (
    <Box p="6">
      <Heading size="md" mb="3">
        State Matrix
      </Heading>
      <VStack align="stretch" gap="3">
        <HStack gap="3" flexWrap="wrap">
          {cell(true, true, "study", "① battle=true / LTR=true / phase=study")}
          {cell(
            true,
            true,
            "recall",
            "② battle=true / LTR=true / phase=recall",
          )}
        </HStack>
        <HStack gap="3" flexWrap="wrap">
          {cell(
            true,
            false,
            "study",
            "③ battle=true / LTR=false / phase=study",
          )}
          {cell(
            false,
            true,
            "study",
            "④ battle=false / LTR=true / phase=study（→ PhaseNoticeは非表示）",
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
