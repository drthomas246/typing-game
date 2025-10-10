import { Box, HStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";
import type { BattleArenaProps } from "@/types/index";
import DamageMotion from "./DamageMotion";
import EnemyHpBar from "./EnemyHpBar";
import EnemyLayer from "./EnemyLayer";
import QuestionPanel from "./QuestionPanel";

// framer-motionでアニメーション可能なdiv要素を作成
const MotionDiv = motion.div;

type HeightOverrides = {
	outerH?: string; // 例: "720px"
	arenaH?: string; // 例: "600px"
};
// 安全フラグの型（BattleArenaPropsへ統合してもOK）
type SafetyFlags = {
	safeNoAnimatePresence?: boolean;
	safeNoDamageMotion?: boolean;
};

/**
 * 戦闘シーンのすべての視覚要素（敵、背景、問題、HPバー、エフェクト）を統合するメインコンポーネント。
 * `forwardRef` を利用して、親コンポーネントから `ref` を受け取り、内部のDOM要素に渡します。
 * これにより、親コンポーネントがこのコンポーネント内のDOMノード（例: 敵表示エリア）のサイズや位置を直接参照できるようになり、エフェクトの計算などに利用されます。
 *
 * @param props - コンポーネントのプロパティ。`BattleArenaProps` 型を参照。
 * @param ref - `forwardRef` を通じて転送される `ref` オブジェクト。敵表示エリアの `div` 要素にアタッチされます。
 */
const BattleArena = forwardRef<HTMLDivElement, BattleArenaProps & HeightOverrides & SafetyFlags>(
	(
		{
			enemyImg,
			backgroundImg,
			hurtId,
			vanishId,
			vanished,
			slashId,
			onVanishDone,
			questionText,
			questionImg,
			state,
			enemyHpPct,
			arenaRef,
			outerH,
			arenaH,
			// ★ 追加: 安全フラグ（既定は false）
			safeNoAnimatePresence = false,
			safeNoDamageMotion = false,
		},
		ref,
	) => {
		const OUTER_H = outerH ?? "calc(100vh - 293px)";
		const ARENA_H = arenaH ?? "calc(100vh - 367px)";

		const EnemyStage = (
			<EnemyLayer
				backgroundImg={backgroundImg}
				enemyImg={enemyImg}
				vanishId={vanishId}
				vanished={vanished}
				onVanishDone={onVanishDone}
			/>
		);

		return (
			<Box rounded="xl" borderWidth="1px" p="4" bg="bg.subtle" h={OUTER_H}>
				<HStack gap="16px" h={ARENA_H} mb="16px">
					<Box
						ref={ref}
						mx="auto"
						w="100%"
						h={ARENA_H}
						rounded="2xl"
						borderWidth="1px"
						overflow="hidden"
						bg="blackAlpha.50"
						position="relative"
					>
						{safeNoAnimatePresence ? (
							// ★ AnimatePresence を使わない安全ルート
							<Box w="100%" h="100%" position="relative">
								{EnemyStage}
							</Box>
						) : (
							<AnimatePresence initial={false} mode="popLayout">
								{hurtId > 0 ? (
									<MotionDiv
										key={`shake-${hurtId}`}
										style={{
											width: "100%",
											height: "100%",
											position: "relative",
										}}
										initial={{ x: 0 }}
										animate={{ x: [0, -14, 14, -10, 10, -6, 6, 0] }}
										transition={{ duration: 0.45, ease: "easeInOut" }}
										exit={{ x: 0 }}
									>
										{EnemyStage}
									</MotionDiv>
								) : (
									<Box w="100%" h="100%" position="relative">
										{EnemyStage}
									</Box>
								)}
							</AnimatePresence>
						)}

						{/* ★ null ガード + 無効化フラグ */}
						{!safeNoDamageMotion && (
							<DamageMotion arenaRef={arenaRef} slashId={slashId} hurtId={hurtId} />
						)}
					</Box>

					<QuestionPanel questionText={questionText} questionImg={questionImg} />
				</HStack>

				<EnemyHpBar current={state.enemyHp} max={state.enemyMaxHp} pct={enemyHpPct} />
			</Box>
		);
	},
);

export default BattleArena;
