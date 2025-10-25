// src/stories/compornents/PhaseNoticeArea/PlayerHpBar.stories.tsx
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
import { PlayerHpBar } from "@/components/typing/PhaseNoticeArea/PlayerHpBar";
import { UserLevelContext } from "@/contexts/PageContext";

export default {
  title: "Components/typing/PhaseNoticeArea/PlayerHpBar",
} satisfies StoryDefault;

// ---- 改良版 Provider: level を外部から受け取る ----
const MockLevelProvider: React.FC<
  React.PropsWithChildren<{ level: number }>
> = ({ level, children }) => {
  return (
    <UserLevelContext.Provider value={level}>
      {children}
    </UserLevelContext.Provider>
  );
};

export const Basic: Story = () => {
  const [level, setLevel] = useState<number>(3);
  const [max, setMax] = useState<number>(100);
  const [current, setCurrent] = useState<number>(60);

  const pct = useMemo(
    () => Math.max(0, Math.min(100, Math.round((current / max) * 100))),
    [current, max],
  );
  const clamp = (v: number) => Math.max(0, Math.min(max, v));

  return (
    <MockLevelProvider level={level}>
      <Box p="6">
        <VStack align="stretch" gap="3" mb="4">
          <Heading size="md">Playground</Heading>

          <HStack gap="2" flexWrap="wrap">
            {/* ★ Lv を上下させると即反映される */}
            <Button
              size="sm"
              onClick={() => setLevel((v) => Math.max(1, v - 1))}
            >
              Lv -1
            </Button>
            <Button size="sm" onClick={() => setLevel((v) => v + 1)}>
              Lv +1
            </Button>

            {/* HP */}
            <Button size="sm" onClick={() => setCurrent((v) => clamp(v - 10))}>
              HP -10
            </Button>
            <Button size="sm" onClick={() => setCurrent((v) => clamp(v + 10))}>
              HP +10
            </Button>

            {/* Max */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMax((m) => Math.max(10, m - 10));
                setCurrent((c) => Math.min(c, Math.max(10, max - 10)));
              }}
            >
              Max -10
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMax((m) => m + 10);
              }}
            >
              Max +10
            </Button>
          </HStack>

          <Box fontSize="sm">
            <Code mr="2">level</Code>
            {level}
            <Code mx="2">current</Code>
            {current}
            <Code mx="2">max</Code>
            {max}
            <Code mx="2">pct</Code>
            {pct}%
          </Box>

          <Separator />
        </VStack>

        <Text fontSize="sm" mb="2">
          下のバーが Level と HP を反映します。
        </Text>

        {/* PlayerHpBar を level と同期して表示 */}
        <PlayerHpBar current={current} max={max} pct={pct} />
      </Box>
    </MockLevelProvider>
  );
};
