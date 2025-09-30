import type { Stage as KonvaStage } from "konva/lib/Stage";
import type { PropsWithChildren } from "react";
import MapView from "@/components/map/MapView";
import { tiles, worldSize } from "@/components/map/mapData";
import { TYPING_ROUTE_POINTS } from "@/data/points";

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
