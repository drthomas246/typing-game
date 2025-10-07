import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { DamageMotionProps } from "@/types/index";

/**
 * 攻撃時の斬撃エフェクトや、被弾時の画面フラッシュエフェクトを制御するコンポーネント。
 * `framer-motion` を利用して、これらのアニメーションを表現します。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.arenaRef - アニメーションの基準となるコンテナ要素への参照。斬撃の移動距離計算に使用されます。
 * @param props.slashId - 斬撃アニメーションのトリガー。このIDが変更される（インクリメントされる）と、新しい斬撃アニメーションが再生されます。
 * @param props.hurtId - 被弾フラッシュアニメーションのトリガー。このIDが変更されると、新しいフラッシュアニメーションが再生されます。
 */
export default function DamageMotion({
  arenaRef,
  slashId,
  hurtId,
}: DamageMotionProps) {
  const [travel, setTravel] = useState(400);

  useEffect(() => {
    if (!arenaRef) return;
    const el = arenaRef;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const d = Math.hypot(rect.width, rect.height) / 2 + 60;
      setTravel(d);
    };

    update(); // 初期計算
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [arenaRef]);
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
              initial={{
                opacity: 0,
                rotate: -45,
                x: +travel,
                y: -travel,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                rotate: -45,
                x: -travel,
                y: +travel,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              exit={{ opacity: 0, rotate: -45 }} // 終了時の状態
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
