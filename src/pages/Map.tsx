import type { Stage as KonvaStage } from "konva/lib/Stage";
import type { PropsWithChildren } from "react";
import MapView from "@/components/map/MapView";
import { tiles, worldSize } from "@/components/map/mapData";
import { TYPING_ROUTE_POINTS } from "@/data/points";

/**
 * マップ画面を描写し、ゲームの進行状況に応じたポイントを配置するページコンポーネント。
 * `MapView`コンポーネントをラップし、ツールチップの表示状態やKonvaステージへの参照を提供します。
 *
 * @param {object} props - このコンポーネントが受け取るプロパティ。
 * @param {boolean} props.showTooltip - マップ上のポイントにツールチップを表示するかどうかを制御するフラグ。
 * @param {React.RefObject<KonvaStage | null>} props.stageRef - Konvaステージ要素への参照オブジェクト。
 * @param {React.ReactNode} props.children - マップビュー内にレンダリングされる子要素。
 * @returns {JSX.Element} マップ画面のUI要素。
 */
export default function MapPage({
  showTooltip,
  stageRef,
  children,
}: PropsWithChildren<{
  showTooltip: boolean;
  stageRef: React.RefObject<KonvaStage | null>;
}>) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapView
        tiles={tiles}
        points={TYPING_ROUTE_POINTS}
        worldSize={worldSize}
        initialCenter={{ x: 2990, y: 1640 }}
        showTooltip={showTooltip}
        stageRef={stageRef}
      >
        {children}
      </MapView>
    </div>
  );
}
