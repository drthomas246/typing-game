import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useLayoutEffect } from "react";

type DamageMotionProps = {
  arenaRef: React.RefObject<HTMLDivElement>;
  slashId: number;
  hurtId: number;
};

export function DamageMotion({ arenaRef, slashId, hurtId }: DamageMotionProps) {
  // 計測できるまではフォールバック距離で開始
  const [travel, setTravel] = React.useState(400);

  const update = React.useCallback(() => {
    const el = arenaRef?.current;
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    const rect = el.getBoundingClientRect();
    const d = Math.hypot(rect.width, rect.height) / 2 + 60;
    setTravel(d);
  }, [arenaRef]);

  // 初期 & トリガ更新時に次フレームで計測（未確定でも落ちない）
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [update]);

  // リサイズ追従
  React.useEffect(() => {
    const el = arenaRef?.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [arenaRef, update]);

  // ✅ ここで「ref が無いなら return null」はしない。常にレイヤーは存在させる
  return (
    <>
      <AnimatePresence>
        {slashId > 0 && (
          <Box
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
            zIndex={10}
          >
            <motion.div
              key={slashId}
              style={{
                width: "160%",
                height: "12px",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg, rgba(255,0,0,0) 0%, rgba(255,0,0,1) 50%, rgba(255,0,0,0) 100%)",
                boxShadow:
                  "0 0 8px rgba(255,0,0,0.9), 0 0 16px rgba(255,0,0,0.6)",
                transformOrigin: "center",
              }}
              initial={{ opacity: 0, rotate: -45, x: +travel, y: -travel }}
              animate={{
                opacity: [0, 1, 1, 0],
                rotate: -45,
                x: -travel,
                y: +travel,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              exit={{ opacity: 0, rotate: -45 }}
            />
          </Box>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hurtId > 0 && (
          <motion.div
            key={`flash-${hurtId}`}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,0,0,0.35)",
              pointerEvents: "none",
              zIndex: 15,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.6,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut",
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
