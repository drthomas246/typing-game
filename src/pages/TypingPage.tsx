import App from "@/App";
import DamageMotion from "@/components/typing/BattleArea/DamageMotion";
import ResultsDialog from "@/components/typing/ResultsDialog";
import SettingsDrawer from "@/components/typing/SettingsDrawer";
import { useTypingEngine } from "@/hooks/typingEngine/useTypingEngine";
import { useBgm } from "@/hooks/typingPage/useBgm";
import { useRandomAssets } from "@/hooks/typingPage/useRandomAssets";
import type { Settings, TypingPageProps } from "@/types/index";
import { Container, Stack, useDisclosure } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import AnswerArea from "@/components/typing/AnswerArea/index";
import BattleArea from "@/components/typing/BattleArea/index";
import HeaderArea from "@/components/typing/HeaderArea";
import PhaseNotice from "@/components/typing/PhaseNoticeArea/PhaseNotice";
import PlayerHpBar from "@/components/typing/PhaseNoticeArea/PlayerHpBar";
import { useLevel, usePage, useSound } from "@/contexts/PageContext";
import { useBattle } from "@/contexts/PageContext";

export default function TypingPage({ QA, title }: TypingPageProps) {
  const level = useLevel();
  const battle = useBattle();
  const [settings, setSettings] = useState<Settings>({
    language: "ja",
    learnThenRecall: true,
  });

  const page = usePage();
  const isBgmOn = useSound();

  const [slashId, setSlashId] = useState(0);
  const [hurtId, setHurtId] = useState(0);
  const [vanishId, setVanishId] = useState(0);
  const [vanished, setVanished] = useState(false);

  const damagePerHit = useMemo(() => 10, []);
  const engine = useTypingEngine(
    {
      learnThenRecall: settings.learnThenRecall,
      battleMode: true,
      playerMaxHp: 100 + (level - 1) * 10,
      enemyMaxHp: damagePerHit * QA.length,
      damagePerHit: 10,
      damagePerMiss: 5,
      learningMode: battle,
    },
    QA,
    setSlashId,
    setHurtId,
    setVanishId,
    setVanished,
  );

  const { enemyImg, backgroundImg } = useRandomAssets();

  const { setShouldPlay } = useBgm({
    src: "./music/bgm/waitScreen.mp3",
    loop: true,
    volume: 0.4,
    enabled: isBgmOn,
  });

  const settingsDisc = useDisclosure();
  const [resultOpen, setResultOpen] = useState(false);

  useEffect(() => {
    if (engine.state.started && engine.state.finished) {
      if (engine.state.enemyHp === 0) {
        setVanishId((n) => n + 1);
      }
      const id = setTimeout(() => setResultOpen(true), 0);
      return () => clearTimeout(id);
    }
  }, [engine.state.started, engine.state.finished, engine.state.enemyHp]);

  const enemyHpPct = useMemo(
    () => Math.round((engine.state.enemyHp / engine.state.enemyMaxHp) * 100),
    [engine.state.enemyHp, engine.state.enemyMaxHp],
  );
  const playerHpPct = useMemo(
    () => Math.round((engine.state.playerHp / engine.state.playerMaxHp) * 100),
    [engine.state.playerHp, engine.state.playerMaxHp],
  );

  const arenaRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {page !== 0 ? (
        <Container p="6" maxW="container.md">
          <Stack gap="6">
            <HeaderArea
              title={title}
              start={engine.start}
              stop={engine.stop}
              state={engine.state}
              setShouldPlay={setShouldPlay}
              settings={settings}
              onOpen={settingsDisc.onOpen}
            />
            <BattleArea
              ref={arenaRef}
              enemyImg={enemyImg}
              backgroundImg={backgroundImg}
              hurtId={hurtId}
              vanishId={vanishId}
              vanished={vanished}
              onVanishDone={() => setVanished(true)}
              slashId={slashId}
              questionText={
                engine.state.questionJa
                  ? engine.state.questionJa
                  : battle
                    ? "問題がここに出るよ"
                    : "バトル開始"
              }
              questionImg={engine.state.questionImg}
              state={engine.state}
              enemyHpPct={enemyHpPct}
              arenaRef={arenaRef.current}
            >
              <DamageMotion
                arenaRef={arenaRef.current}
                slashId={slashId}
                hurtId={hurtId}
              />
            </BattleArea>

            {battle && (
              <PhaseNotice
                learnThenRecall={settings.learnThenRecall}
                phase={
                  engine.state.learningPhase as "study" | "recall" | undefined
                }
              />
            )}
            {!battle && (
              <PlayerHpBar
                current={engine.state.playerHp}
                max={engine.state.playerMaxHp}
                pct={playerHpPct}
              />
            )}

            <AnswerArea
              typed={engine.state.typed}
              correctMap={engine.state.correctMap}
              answer={engine.state.answerEn}
              showHint={engine.state.showHint}
              state={engine.state}
              inputOnKey={engine.onKey}
              resultOpen={resultOpen}
              engine={engine}
            />
          </Stack>

          <SettingsDrawer
            open={settingsDisc.open}
            onClose={settingsDisc.onClose}
            settings={settings}
            onChange={setSettings}
            engine={engine}
          />

          <ResultsDialog
            open={resultOpen}
            setOpen={setResultOpen}
            onRetry={() => {
              setResultOpen(false);
              engine.start();
            }}
            setShouldBgmPlay={setShouldPlay}
            summary={{
              timeSec: engine.actualTimeSec,
              usedHintCount: engine.state.usedHintCount,
              mistakeProblemCount: engine.state.mistakeProblemCount,
              killedNow: engine.state.enemyHp === 0 && battle !== true,
            }}
          />
        </Container>
      ) : (
        <App played={false} />
      )}
    </>
  );
}
