import { Badge, HStack, Text } from "@chakra-ui/react";
import { useBattle } from "@/contexts/PageContext";
import type { PhaseNoticeProps } from "@/types/index";

/**
 * 現在の学習フェーズ（練習、復習など）をユーザーに通知するコンポーネント。
 * 学習モードに応じて表示するテキストやバッジの色が変化します。
 *
 * @param {PhaseNoticeProps} props - コンポーネントのプロパティ。
 * @param {boolean} props.learnThenRecall - `true`の場合、練習フェーズの後に復習フェーズがある学習モードであることを示します。
 * @param {'study' | 'recall'} props.phase - 現在の学習フェーズを示します。`study`は練習、`recall`は復習フェーズです。
 * @returns {JSX.Element | null} 学習フェーズを示すUI。battleコンテキストが存在しない場合は`null`を返します。
 */
export default function PhaseNotice({ learnThenRecall, phase }: PhaseNoticeProps) {
	const battle = useBattle();
	if (!battle) return null;

	if (learnThenRecall) {
		const isStudy = phase === "study";
		return (
			<HStack h="24px">
				<Badge colorScheme={isStudy ? "blue" : "purple"} variant="solid">
					{isStudy
						? "練習（スペル＋音声）"
						: "ふく習（Tabキーでヒント。1回目で音声・2回目でスペル）"}
				</Badge>
				<Text fontSize="sm" color="fg.muted">
					学習で正かい → ふく習へ ふく習で正かいすると次の問題に進みます。
				</Text>
			</HStack>
		);
	}

	return (
		<HStack h="24px">
			<Badge colorScheme="blue" variant="solid">
				練習（スペル＋音声）
			</Badge>
			<Text fontSize="sm" color="fg.muted">
				学習で正かい → 次の問題に進みます。
			</Text>
		</HStack>
	);
}
