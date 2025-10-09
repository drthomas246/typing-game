import { Box } from "@chakra-ui/react";
import type { Stage as KonvaStage } from "konva/lib/Stage";
import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { Title } from "@/components/map/Title";
import type { MapPoint, Tile } from "@/types/index";

/**
 * ビューポートの固定幅。
 * このコンポーネントは、この幅を基準にアスペクト比を維持してスケーリングします。
 */
const VIEW_W = 1744;
/**
 * ビューポートの固定高さ。
 * このコンポーネントは、この高さを基準にアスペクト比を維持してスケーリングします。
 */
const VIEW_H = 981;

/**
 * 1枚のマップタイルをKonvaで描画するコンポーネント。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.src - 画像ソースのURL。
 * @param props.x - タイルのx座標。
 * @param props.y - タイルのy座標。
 * @returns KonvaのImageコンポーネント。
 */
function TileImage({ src, x, y }: { src: string; x: number; y: number }) {
	const [img] = useImage(src, "anonymous");
	return <KonvaImage image={img ?? undefined} x={x} y={y} />;
}

/**
 * {@link MapViewFixedViewport} コンポーネントのプロパティ。
 */
type MapViewFixedViewportProps = PropsWithChildren<{
	/** マップを構成するタイルの配列。 */
	tiles: ReadonlyArray<Tile>;
	/** マップ上に表示されるポイントの配列。 */
	points: ReadonlyArray<MapPoint>;
	/** ワールド全体のサイズ。ドラッグ範囲の計算に使用されます。 */
	worldSize: { width: number; height: number };
	/**
	 * マップの初期表示位置（ワールド座標系の中心）。
	 * @default ワールドの右下隅
	 */
	initialCenter?: { x: number; y: number };
	/**
	 * ポイントのツールチップを表示するかどうか。
	 * @default false
	 */
	showTooltip: boolean;
	/** KonvaのStageオブジェクトへの外部参照。 */
	stageRef: React.RefObject<KonvaStage | null>;
}>;

/**
 * 固定サイズのビューポートでマップを表示し、ドラッグによる移動が可能なコンポーネント。
 * 親要素のサイズに合わせて、ビューポートのアスペクト比を維持しながらスケールします。
 * @param props - コンポーネントのプロパティ。
 */
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
}: MapViewFixedViewportProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [container, setContainer] = useState({ w: 1308, h: 736 });

	const [stagePos, setStagePos] = useState<{ x: number; y: number }>(() => {
		return {
			x: -(initialCenter.x - VIEW_W / 2),
			y: -(initialCenter.y - VIEW_H / 2),
		};
	});
	const scale = Math.min(container.w / VIEW_W, container.h / VIEW_H);

	const offset = {
		x: (container.w - VIEW_W * scale) / 2,
		y: (container.h - VIEW_H * scale) / 2,
	};

	/**
	 * 現在のビューポートに表示されるべきタイルのみをフィルタリングします。
	 * ビューポート外のタイルを描画しないことで、パフォーマンスを向上させます。
	 * @remarks `useMemo` を使用して、`tiles` または `stagePos` が変更された場合にのみ再計算します。
	 */
	const visibleTiles = useMemo(() => {
		const view = {
			left: -stagePos.x,
			top: -stagePos.y,
			right: -stagePos.x + VIEW_W,
			bottom: -stagePos.y + VIEW_H,
		};
		return tiles.filter(
			(t) =>
				!(t.x + t.w < view.left || t.y + t.h < view.top || t.x > view.right || t.y > view.bottom),
		);
	}, [tiles, stagePos]);

	/**
	 * ドラッグ時の移動範囲をワールドの境界内に制限する関数。
	 * @param p - ドラッグによって更新されたKonva Stageの座標。
	 * @returns 境界内に補正された座標。
	 */
	const dragBoundFunc = (p: { x: number; y: number }) => {
		const minWorldX = Math.min(0, VIEW_W - worldSize.width);
		const minWorldY = Math.min(0, VIEW_H - worldSize.height);
		return {
			x: Math.max(minWorldX, Math.min(0, p.x)),
			y: Math.max(minWorldY, Math.min(0, p.y)),
		};
	};

	/**
	 * ワールド座標系のポイントを、現在の表示スケールと位置に合わせてスクリーン座標系に変換します。
	 * ツールチップの表示位置計算に使用されます。
	 * @remarks `useMemo` を使用して、依存する値が変更された場合にのみ再計算します。
	 */
	const screenPoints = useMemo(
		() =>
			points.map((p) => {
				const s = {
					x: offset.x + (stagePos.x + p.x) * scale,
					y: offset.y + (stagePos.y + p.y) * scale,
				};
				return { ...p, sx: s.x + 12, sy: s.y - 8 };
			}),
		[points, stagePos.x, stagePos.y, scale, offset.x, offset.y],
	);

	useEffect(() => {
		if (!containerRef.current) return;
		const ro = new ResizeObserver((entries) => {
			const r = entries[0].contentRect;
			setContainer({ w: Math.round(r.width), h: Math.round(r.height) });
		});
		ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, []);

	return (
		<Box ref={containerRef} w="100%" h="100%" bg="#222" position="relative" overflow="hidden">
			<Stage
				ref={stageRef}
				width={container.w}
				height={container.h}
				draggable
				x={offset.x + stagePos.x * scale}
				y={offset.y + stagePos.y * scale}
				scaleX={scale}
				scaleY={scale}
				onDragMove={(e) => {
					const sx = (e.target.x() - offset.x) / scale;
					const sy = (e.target.y() - offset.y) / scale;
					setStagePos({ x: sx, y: sy });
				}}
				onDragEnd={(e) => {
					const sx = (e.target.x() - offset.x) / scale;
					const sy = (e.target.y() - offset.y) / scale;
					const bounded = dragBoundFunc({ x: sx, y: sy });
					setStagePos(bounded);
					e.target.position(bounded);
				}}
				style={{ background: "#000" }}
			>
				<Layer>
					<Group
						onMouseEnter={() => {
							const c = stageRef.current?.container();
							if (c) c.style.cursor = "all-scroll";
						}}
						onMouseLeave={() => {
							const c = stageRef.current?.container();
							if (c) c.style.cursor = "default";
						}}
					>
						{visibleTiles.map((t) => (
							<TileImage key={`${t.x},${t.y}`} src={t.src} x={t.x} y={t.y} />
						))}
					</Group>
					<Group
						onMouseEnter={() => {
							const c = stageRef.current?.container();
							if (c) c.style.cursor = "grab";
						}}
						onMouseLeave={() => {
							const c = stageRef.current?.container();
							if (c) c.style.cursor = "default";
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
			<Title
				containRect={{
					x: offset.x,
					y: 0,
					w: VIEW_W * scale,
					h: VIEW_H * scale,
				}}
			/>
		</Box>
	);
}
