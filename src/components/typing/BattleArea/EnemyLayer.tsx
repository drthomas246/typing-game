import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { EnemyLayerProps } from "@/types/index";

// framer-motionでアニメーション可能なimg要素を作成
const MotionImg = motion.img;

/**
 * 戦闘シーンの背景と敵キャラクターを表示するレイヤーコンポーネント。
 * 敵キャラクターが倒された際の消滅アニメーションも担当します。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.backgroundImg - 表示する背景画像のURL。
 * @param props.enemyImg - 表示する敵キャラクターの画像のURL。
 * @param props.vanishId - 敵の消滅アニメーションをトリガーするためのID。この値が変更される（インクリメントされる）とアニメーションが開始されます。
 * @param props.vanished - 敵が完全に消滅したかどうかを示すフラグ。trueの場合、敵画像はレンダリングされません。
 * @param props.onVanishDone - 消滅アニメーションが完了したときに呼び出されるコールバック関数。
 * @returns レンダリングされた背景と敵キャラクターのレイヤー。
 */
export default function EnemyLayer({
  backgroundImg,
  enemyImg,
  vanishId,
  vanished,
  onVanishDone,
}: EnemyLayerProps) {
  return (
    <>
      {/* 背景画像 */}
      <Image
        src={backgroundImg}
        alt="Background"
        fit="cover"
        w="100%"
        h="100%"
      />
      {!vanished && (
        <MotionImg
          key={`monster-${vanishId}`}
          src={enemyImg}
          alt="Enemy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          initial={{ opacity: 1, scale: 1, x: 0 }}
          animate={{
            opacity: vanishId > 0 ? [1, 1, 0] : 1,
            x:
              vanishId > 0
                ? [0, -20, 20, -18, 18, -15, 15, -10, 10, -5, 5, 0]
                : 0,
            scale: vanishId > 0 ? 0.95 : 1,
          }}
          transition={{
            opacity: { duration: 1.2, ease: "easeOut", times: [0, 0.6, 1] },
            x: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 1.2, ease: "easeOut" },
          }}
          onAnimationComplete={() => {
            if (vanishId > 0) onVanishDone();
          }}
        />
      )}
    </>
  );
}
