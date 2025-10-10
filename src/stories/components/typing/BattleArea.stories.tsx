import type { Story, StoryDefault } from "@ladle/react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Code,
  Separator, // v3: Divider 代替
  Slider, // v3: <Slider.Root> 名前空間
  Switch,
  Field,
} from "@chakra-ui/react";
import React, { useMemo, useRef, useState } from "react";
import BattleArena from "@/components/typing/BattleArea";

// ========== ErrorBoundary ==========
class DebugBoundary extends React.Component<
  { children: React.ReactNode },
  { error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    // 必要なら console にも詳細出力
    // eslint-disable-next-line no-console
    console.error("DebugBoundary caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <Box p="4" borderWidth="1px" rounded="md" bg="red.50" color="red.700">
          <Text fontWeight="bold">💥 Runtime Error</Text>
          <Text whiteSpace="pre-wrap" fontSize="sm">
            {String(this.state.error?.message ?? this.state.error)}
          </Text>
          <Text mt="2" fontSize="xs" opacity={0.8}>
            ブラウザの DevTools（Console）にもスタックが出ています。
          </Text>
        </Box>
      );
    }
    return this.props.children as any;
  }
}

// ===== プレースホルダー画像（data URI） =====
const BG_DATA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-size="36">Background</text>
    </svg>`,
  );

const ENEMY_DATA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <circle cx="200" cy="200" r="140" fill="#ef4444"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="32">Enemy</text>
    </svg>`,
  );

const QIMG_DATA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="120">
      <rect width="100%" height="100%" fill="#22c55e"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="24">Question Image</text>
    </svg>`,
  );

// ===== Ladle Meta =====
export default {
  title: "Components/typing/BattleArea",
} satisfies StoryDefault;

// ===== Story 本体 =====
export const Basic: Story = () => {
  // --- 外から渡す state（最小モック） ---
  const [enemyHp, setEnemyHp] = useState<number>(80);
  const [enemyMaxHp] = useState<number>(100);

  const [hurtId, setHurtId] = useState<number>(0);
  const [slashId, setSlashId] = useState<number>(0);
  const [vanishId, setVanishId] = useState<number>(0);
  const [vanished, setVanished] = useState<boolean>(false);

  // 切り分けトグル
  const [safeNoAnimatePresence, setSafeNoAnimatePresence] = useState(false);
  const [safeNoDamageMotion, setSafeNoDamageMotion] = useState(false);
  const [safeNoSlider, setSafeNoSlider] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);

  const enemyHpPct = useMemo(
    () => Math.round((enemyHp / enemyMaxHp) * 100),
    [enemyHp, enemyMaxHp],
  );

  const state = useMemo(() => ({ enemyHp, enemyMaxHp }), [enemyHp, enemyMaxHp]);

  // --- ハンドラ群 ---
  const doHurt = () => setHurtId((n) => n + 1);
  const doSlash = () => setSlashId((n) => n + 1);
  const startVanish = () => {
    setVanishId((n) => n + 1);
    setVanished(false);
  };
  const onVanishDone = () => setVanished(true);

  const heal = (v = 10) => setEnemyHp((hp) => Math.min(enemyMaxHp, hp + v));
  const damage = (v = 10) => setEnemyHp((hp) => Math.max(0, hp - v));
  const resetAll = () => {
    setEnemyHp(80);
    setHurtId(0);
    setSlashId(0);
    setVanishId(0);
    setVanished(false);
  };

  return (
    <DebugBoundary>
      <Box p="6">
        {/* 操作パネル */}
        <VStack align="stretch" gap="3" mb="4">
          <HStack gap="2" flexWrap="wrap">
            <Button size="sm" onClick={doHurt}>
              被ダメ（hurt 揺れ）
            </Button>
            <Button size="sm" onClick={doSlash}>
              斬撃（slash）
            </Button>
            <Button size="sm" onClick={startVanish} disabled={vanished}>
              敵消滅開始（vanish）
            </Button>
            <Button size="sm" variant="outline" onClick={resetAll}>
              リセット
            </Button>
          </HStack>

          <HStack gap="4" align="start">
            <VStack align="stretch" minW="220px">
              <Button size="sm" onClick={() => damage(10)}>
                HP -10
              </Button>
              <Button size="sm" onClick={() => heal(10)}>
                HP +10
              </Button>

              {/* 切り分け用フラグ */}
              <Field.Root orientation="horizontal" alignItems="center" gap="2">
                <Field.Label fontSize="sm" mr="2">
                  No AnimatePresence
                </Field.Label>

                <Switch.Root
                  checked={safeNoAnimatePresence}
                  // v3: onCheckedChange は { checked: boolean } を受け取る
                  onCheckedChange={(details) =>
                    setSafeNoAnimatePresence(details.checked)
                  }
                >
                  <Switch.HiddenInput /> {/* ← これが重要 */}
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </Field.Root>

              <Field.Root orientation="horizontal" alignItems="center" gap="2">
                <Field.Label fontSize="sm" mr="2">
                  No DamageMotion
                </Field.Label>

                <Switch.Root
                  checked={safeNoDamageMotion}
                  onCheckedChange={(details) =>
                    setSafeNoDamageMotion(details.checked)
                  }
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </Field.Root>

              <Field.Root orientation="horizontal" alignItems="center" gap="2">
                <Field.Label fontSize="sm" mr="2">
                  No Slider
                </Field.Label>

                <Switch.Root
                  checked={safeNoSlider}
                  onCheckedChange={(details) =>
                    setSafeNoSlider(details.checked)
                  }
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </Field.Root>
            </VStack>

            {/* スライダー（v3 名前空間）。問題切り分けのためOFFにできる */}
            {!safeNoSlider && (
              <Box flex="1">
                <Text fontSize="sm" mb="1">
                  HP スライダー: {enemyHp} / {enemyMaxHp}
                </Text>
                <Slider.Root
                  value={[enemyHp]}
                  min={0}
                  max={enemyMaxHp}
                  onValueChange={(details: any) => setEnemyHp(details.value[0])}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumb index={0} />
                  </Slider.Control>
                </Slider.Root>
              </Box>
            )}
          </HStack>

          <Box fontSize="sm">
            <Code mr="2">hurtId</Code>
            {hurtId}
            <Code mx="2">slashId</Code>
            {slashId}
            <Code mx="2">vanishId</Code>
            {vanishId}
            <Code mx="2">vanished</Code>
            {String(vanished)}
            <Code mx="2">enemyHpPct</Code>
            {enemyHpPct.toFixed(2)}
          </Box>

          <Separator />
        </VStack>

        {/* BattleArena 本体 */}
        <BattleArena
          enemyImg={ENEMY_DATA}
          backgroundImg={BG_DATA}
          hurtId={hurtId}
          slashId={slashId}
          vanishId={vanishId}
          vanished={vanished}
          onVanishDone={onVanishDone}
          questionText="What is the antonym of 'hot'?"
          questionImg={QIMG_DATA}
          state={state as any}
          enemyHpPct={enemyHpPct}
          arenaRef={arenaRef}
          ref={arenaRef}
          outerH="720px"
          arenaH="600px"
          // ★ 追加: Story のトグルを BattleArena に反映
          safeNoAnimatePresence={safeNoAnimatePresence}
          safeNoDamageMotion={safeNoDamageMotion}
        />
      </Box>
    </DebugBoundary>
  );
};
