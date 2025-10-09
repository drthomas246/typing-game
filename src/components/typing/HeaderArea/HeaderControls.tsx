import { Button, HStack } from "@chakra-ui/react";
import { useBattle } from "@/contexts/PageContext";
import type { HeaderControlsProps } from "@/types/index";

/**
 * ゲームのヘッダーエリアに表示される操作ボタン（戻る、設定、開始/終了など）をまとめたコンポーネント。
 * ゲームの状態に応じて「始める」ボタンと「終わる」ボタンの表示が切り替わります。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.started - ゲームが開始されているかどうかを示すフラグ。
 * @param props.finished - ゲームが終了しているかどうかを示すフラグ。
 * @param props.onStart - 「始める」ボタンがクリックされたときに呼び出されるコールバック関数。
 * @param props.onEscape - 「終わる」または「にげる」ボタンがクリックされたときに呼び出されるコールバック関数。
 * @param props.onOpenSettings - 「せってい」ボタンがクリックされたときに呼び出されるコールバック関数。
 * @param props.onBack - 「もどる」ボタンがクリックされたときに呼び出されるコールバック関数。
 * @returns レンダリングされたヘッダーコントロールボタン。
 */
export default function HeaderControls({
	started,
	finished,
	onStart,
	onEscape,
	onOpenSettings,
	onBack,
}: HeaderControlsProps) {
	const battle = useBattle();
	return (
		<HStack>
			<Button onClick={onBack} variant="outline">
				もどる
			</Button>
			<Button onClick={onOpenSettings} variant="outline">
				せってい
			</Button>
			{!started || finished ? (
				<Button colorPalette="blue" onClick={onStart}>
					{battle ? "始める" : "バトル"}
				</Button>
			) : (
				<Button colorPalette="red" onClick={onEscape}>
					{battle ? "終わる" : "にげる"}
				</Button>
			)}
		</HStack>
	);
}
