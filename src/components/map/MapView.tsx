import { Box } from "@chakra-ui/react";
import type { Stage as KonvaStage } from "konva/lib/Stage";
import React, {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group, Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { Title } from "@/components/map/Title";
import type { MapPoint, Tile } from "@/types/index";

/** 設計上の基準（ワールドの想定原寸） */
const VIEW_W = 1744;
const VIEW_H = 981;

/** 1枚のタイル */
function TileImage({ src, x, y }: { src: string; x: number; y: number }) {
  const [img] = useImage(src, "anonymous");
  return (
    <KonvaImage
      image={img ?? undefined}
      x={x}
      y={y}
      listening={false}
      perfectDrawEnabled={false}
    />
  );
}

type MapViewFixedViewportProps = PropsWithChildren<{
  tiles: ReadonlyArray<Tile>;
  points: ReadonlyArray<MapPoint>;
  worldSize: { width: number; height: number };
  /** 初期表示（world中心）。既定：右下寄り */
  initialCenter?: { x: number; y: number };
  showTooltip: boolean;
  stageRef: React.RefObject<KonvaStage | null>;
  /** 黒帯を無くすには cover を使う */
  mode?: "cover" | "contain";
}>;

export default function MapViewFixedViewport({
  tiles,
  points,
  worldSize,
  initialCenter = {
    x: worldSize.width - VIEW_W / 2,
    y: worldSize.height - VIEW_H / 2,
  },
  showTooltip = false,
  stageRef,
  children,
  mode = "cover",
}: MapViewFixedViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [container, setContainer] = useState({ w: 1308, h: 736 });

  // world系のステージ位置（左上）
  const [stagePos, setStagePos] = useState<{ x: number; y: number }>(() => ({
    x: -(initialCenter.x - VIEW_W / 2),
    y: -(initialCenter.y - VIEW_H / 2),
  }));

  // スケール：cover=常に全面を埋める、contain=黒帯ありうる
  const rawScale = useMemo(() => {
    const sx = container.w / VIEW_W;
    const sy = container.h / VIEW_H;
    return mode === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
  }, [container.w, container.h, mode]);

  // 実視野（world座標）＝ 画面サイズを scale で割ったもの
  const viewW = useMemo(() => container.w / rawScale, [container.w, rawScale]);
  const viewH = useMemo(() => container.h / rawScale, [container.h, rawScale]);

  // contain の時だけセンタリング用 offset を使う（cover は 0）
  const offset = useMemo(() => {
    if (mode === "contain") {
      // デザインVIEWに対する letter/pillar box
      const scaleContain = Math.min(container.w / VIEW_W, container.h / VIEW_H);
      return {
        x: Math.round((container.w - VIEW_W * scaleContain) / 2),
        y: Math.round((container.h - VIEW_H * scaleContain) / 2),
      };
    }
    return { x: 0, y: 0 };
  }, [container.w, container.h, mode]);

  // world が視野より小さい軸は中央固定（その軸はドラッグ不可）
  const worldNarrowX = worldSize.width <= viewW;
  const worldNarrowY = worldSize.height <= viewH;

  // world境界（world系）: 画面を常に埋めるためのクランプ
  // 視野(viewW/H) と worldSize 比から端位置を計算
  const minWorldX = worldNarrowX
    ? (viewW - worldSize.width) / 2
    : viewW - worldSize.width;
  const maxWorldX = worldNarrowX ? minWorldX : 0;
  const minWorldY = worldNarrowY
    ? (viewH - worldSize.height) / 2
    : viewH - worldSize.height;
  const maxWorldY = worldNarrowY ? minWorldY : 0;

  // 実際の world 位置（狭い軸は固定）
  const worldX = worldNarrowX ? minWorldX : stagePos.x;
  const worldY = worldNarrowY ? minWorldY : stagePos.y;

  // 画面座標（整数スナップ）: cover のとき offset は 0
  const stageScreenX = Math.round(offset.x + worldX * rawScale);
  const stageScreenY = Math.round(offset.y + worldY * rawScale);

  // 可視タイル（±1px バッファ、world視野で判定）
  const visibleTiles = useMemo(() => {
    const view = {
      left: -worldX - 1,
      top: -worldY - 1,
      right: -worldX + viewW + 1,
      bottom: -worldY + viewH + 1,
    };
    return tiles.filter(
      (t) =>
        !(
          t.x + t.w < view.left ||
          t.y + t.h < view.top ||
          t.x > view.right ||
          t.y > view.bottom
        ),
    );
  }, [tiles, worldX, worldY, viewW, viewH]);

  // 画面座標 dragBoundFunc（coverは黒帯ゼロ、containは offset内でクランプ）
  const dragBoundFuncScreen = useCallback(
    (p: { x: number; y: number }) => {
      // world系 → screen系変換（端位置）
      const minScreenX = offset.x + minWorldX * rawScale;
      const maxScreenX = offset.x + maxWorldX * rawScale;
      const minScreenY = offset.y + minWorldY * rawScale;
      const maxScreenY = offset.y + maxWorldY * rawScale;

      // 内側1pxでクランプし、整数スナップ（継ぎ目対策）
      const xClamped = Math.max(
        Math.ceil(minScreenX + 1),
        Math.min(Math.floor(maxScreenX - 1), p.x),
      );
      const yClamped = Math.max(
        Math.ceil(minScreenY + 1),
        Math.min(Math.floor(maxScreenY - 1), p.y),
      );
      return { x: Math.round(xClamped), y: Math.round(yClamped) };
    },
    [minWorldX, maxWorldX, minWorldY, maxWorldY, offset.x, offset.y, rawScale],
  );

  // HTMLオーバーレイ用に world→screen 変換（cover でも contain でも一貫）
  const screenPoints = useMemo(
    () =>
      points.map((p) => {
        const sx = offset.x + (worldX + p.x) * rawScale;
        const sy = offset.y + (worldY + p.y) * rawScale;
        return { ...p, sx: sx + 12, sy: sy - 8 };
      }),
    [points, worldX, worldY, rawScale, offset.x, offset.y],
  );

  // リサイズ
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setContainer({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ドラッグ（命令的 position は使わない）
  const handleDragMove = useCallback(
    (e: any) => {
      const wx = (e.target.x() - offset.x) / rawScale;
      const wy = (e.target.y() - offset.y) / rawScale;
      setStagePos((prev) => ({
        x: worldNarrowX
          ? prev.x
          : Math.max(minWorldX, Math.min(maxWorldX, Math.round(wx))),
        y: worldNarrowY
          ? prev.y
          : Math.max(minWorldY, Math.min(maxWorldY, Math.round(wy))),
      }));
    },
    [
      offset.x,
      offset.y,
      rawScale,
      worldNarrowX,
      worldNarrowY,
      minWorldX,
      maxWorldX,
      minWorldY,
      maxWorldY,
    ],
  );

  const handleDragEnd = useCallback(
    (e: any) => {
      const wx = (e.target.x() - offset.x) / rawScale;
      const wy = (e.target.y() - offset.y) / rawScale;
      setStagePos((prev) => ({
        x: worldNarrowX
          ? prev.x
          : Math.max(minWorldX, Math.min(maxWorldX, Math.round(wx))),
        y: worldNarrowY
          ? prev.y
          : Math.max(minWorldY, Math.min(maxWorldY, Math.round(wy))),
      }));
    },
    [
      offset.x,
      offset.y,
      rawScale,
      worldNarrowX,
      worldNarrowY,
      minWorldX,
      maxWorldX,
      minWorldY,
      maxWorldY,
    ],
  );

  const draggable = !(worldNarrowX && worldNarrowY);

  return (
    <Box
      ref={containerRef}
      w="100%"
      h="100%"
      bg="#222"
      position="relative"
      overflow="hidden"
    >
      <Stage
        ref={stageRef as React.LegacyRef<KonvaStage>}
        width={container.w}
        height={container.h}
        draggable={draggable}
        x={stageScreenX}
        y={stageScreenY}
        scaleX={rawScale}
        scaleY={rawScale}
        dragBoundFunc={dragBoundFuncScreen}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        style={{ background: "#000" }}
      >
        <Layer>
          <Group
            onMouseEnter={() => {
              const c = stageRef.current?.container();
              if (c) {
                c.style.cursor = "all-scroll";
              }
            }}
            onMouseLeave={() => {
              const c = stageRef.current?.container();
              if (c) {
                c.style.cursor = "default";
              }
            }}
          >
            {visibleTiles.map((t) => (
              <TileImage key={`${t.x},${t.y}`} src={t.src} x={t.x} y={t.y} />
            ))}
          </Group>

          <Group
            onMouseEnter={() => {
              const c = stageRef.current?.container();
              if (c) {
                c.style.cursor = "grab";
              }
            }}
            onMouseLeave={() => {
              const c = stageRef.current?.container();
              if (c) {
                c.style.cursor = "default";
              }
            }}
          >
            {children}
          </Group>
        </Layer>
      </Stage>

      {showTooltip &&
        screenPoints.map((sp) => (
          <Box
            key={`tip-${sp.id}`}
            position="absolute"
            left={sp.sx}
            top={sp.sy}
            transform="translateY(-100%)"
            bg="tomato"
            color="white"
            px="8px"
            py="6px"
            fontSize={14}
            borderRadius={6}
            pointerEvents="none"
            whiteSpace="nowrap"
            boxShadow="0 4px 12px rgba(0,0,0,0.2)"
            zIndex={1}
            aria-hidden
          >
            <Box fontSize="20px" fontWeight="bold" color="gray.50">
              {sp.title}
            </Box>
          </Box>
        ))}

      {/* Title の矩形も実視野で指定（contain なら設計VIEW基準でもよいが、coverでは画面全面に合わせるのが自然） */}
      <Title
        containRect={{
          x: 0,
          y: 0,
          w: container.w,
          h: container.h,
        }}
      />
    </Box>
  );
}
