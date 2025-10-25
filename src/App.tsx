import { Box } from "@chakra-ui/react";
import { Howler } from "howler";
import type { Stage as KonvaStage } from "konva/lib/Stage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Circle } from "react-konva";

import { ConsentDialog } from "@/components/ui/ConsentDialog";
import { SlideOverlay } from "@/components/visuals/SlideOverlay";
import { TitleOverlay } from "@/components/visuals/TitleOverlay";
import {
  usePage,
  useSetPage,
  useSetSound,
  useSound,
} from "@/contexts/PageContext";
import { TYPING_ROUTE_POINTS } from "@/data/points";
import { useBgm } from "@/hooks/useBgm";
import { useHowlerOneShot } from "@/hooks/useHowlerOneShot";
import { useSequence } from "@/hooks/useSequence";
import { useSpeech } from "@/hooks/useSpeech";
import MapPage from "@/pages/Map";
import { TypingPage } from "@/pages/TypingPage";
import type { AppProps, MapPoint } from "@/types/index";

/**
 * HowlerのAudioContextが停止状態（suspended）の場合、ユーザー操作に応じて再開（resume）します。
 * 多くのブラウザで音声の自動再生が制限されているため、最初のユーザーインタラクションで呼び出す必要があります。
 * @returns {Promise<void>} Contextの再開が完了するか、不要であれば解決するPromise。
 */
function resumeHowlerContextIfNeeded(): Promise<void> {
  // Howlerの内部Contextにアクセスするための型アサーション
  const h = Howler as unknown as { ctx?: AudioContext };
  const ctx = h.ctx;
  if (ctx && ctx.state === "suspended") {
    return ctx.resume();
  }
  return Promise.resolve();
}

/**
 * アプリケーションのメインコンポーネント。
 * ページ遷移、BGM/サウンドエフェクト（SE）の制御、初回アクセス時の同意ダイアログとタイトルシーケンスを管理します。
 * @param {AppProps} props - コンポーネントのプロパティ。
 * @param {boolean} [props.played=true] - 過去に一度アプリをプレイしたことがあるかどうかのフラグ。
 * @returns {JSX.Element} 現在のページ（マップまたはタイピング）を表示するJSX要素。
 */
export function App({ played = true }: AppProps): React.ReactElement {
  const page = usePage();
  const setPage = useSetPage();

  const [firstPlayed, setFirstPlayed] = useState<boolean>(played);
  const isBgmOn = useSound();
  const setIsBgmOn = useSetSound();

  const [consentOpen, setConsentOpen] = useState<boolean>(firstPlayed);
  const [showTooltip, setShowTooltip] = useState<boolean>(!played);

  const { ensurePlaying, fadeOutStop } = useBgm(
    "./music/bgm/mainTheme.mp3",
    0.4,
  );

  const { play: playSe } = useHowlerOneShot(
    "./music/soundEffects/screenTransition.mp3",
    1.0,
  );

  const seq = useSequence({
    firstPlayed,
    titleSrc: "./images/title/title.png",
    onFinishFirst: () => setFirstPlayed(false),
  });

  const { warmup, waitUntilReady } = useSpeech();

  const stageRef = useRef<KonvaStage>(null);

  useEffect(() => {
    const onPointer = () => {
      resumeHowlerContextIfNeeded();
      window.removeEventListener("pointerdown", onPointer);
    };
    window.addEventListener("pointerdown", onPointer, { once: true });
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  useEffect(() => {
    if (isBgmOn && page === 0) ensurePlaying(800);
    else fadeOutStop(500);
  }, [page, isBgmOn, ensurePlaying, fadeOutStop]);

  useEffect(() => {
    if (page === 0 && isBgmOn) ensurePlaying(0);
  }, [page, isBgmOn, ensurePlaying]);

  const handleConsentYes = useCallback(() => {
    setConsentOpen(false);
    setIsBgmOn(true);
    ensurePlaying(800);
    seq.start(setShowTooltip);
  }, [ensurePlaying, seq, setIsBgmOn]);

  const handleConsentNo = useCallback(() => {
    setConsentOpen(false);
    setIsBgmOn(false);
    seq.start(setShowTooltip);
  }, [seq, setIsBgmOn]);

  const onSelectPoint = useCallback(
    async (id: number) => {
      console.log(isBgmOn);
      if (isBgmOn) {
        fadeOutStop(500);
        playSe();
      }
      await waitUntilReady();
      await warmup();
      setPage(id);
    },
    [setPage, isBgmOn, fadeOutStop, playSe, waitUntilReady, warmup],
  );

  const points: MapPoint[] = useMemo(() => TYPING_ROUTE_POINTS, []);

  return (
    <>
      {page === 0 ? (
        <Box pos="relative" w="100vw" h="100vh" bg="black">
          {firstPlayed && (
            <ConsentDialog
              open={consentOpen}
              onOpenChange={setConsentOpen}
              onYes={handleConsentYes}
              onNo={handleConsentNo}
            />
          )}

          <MapPage showTooltip={showTooltip} stageRef={stageRef}>
            {points.map((p) => (
              <Circle
                key={p.id}
                x={p.x}
                y={p.y}
                radius={10}
                fill="#ff5252"
                onClick={() => onSelectPoint(p.id)}
              />
            ))}
          </MapPage>

          {firstPlayed && (
            <>
              <TitleOverlay
                src="./images/title/title.png"
                visible={seq.title.visible}
                animateCtrl={seq.title.ctrl}
              />
              <SlideOverlay
                side="top"
                src="./images/title/top.png"
                visible={seq.top.visible}
                animateCtrl={seq.top.ctrl}
              />
              <SlideOverlay
                side="bottom"
                src="./images/title/bottom.png"
                visible={seq.bottom.visible}
                animateCtrl={seq.bottom.ctrl}
              />
              <SlideOverlay
                side="right"
                src="./images/title/right.png"
                visible={seq.right.visible}
                animateCtrl={seq.right.ctrl}
              />
              <SlideOverlay
                side="left"
                src="./images/title/left.png"
                visible={seq.left.visible}
                animateCtrl={seq.left.ctrl}
              />
            </>
          )}
        </Box>
      ) : (
        <TypingPage
          QA={TYPING_ROUTE_POINTS[page - 1].QA}
          title={TYPING_ROUTE_POINTS[page - 1].title}
          sound={isBgmOn} // BGMのオン/オフ状態を渡す
        />
      )}
    </>
  );
}
