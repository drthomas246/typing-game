import { Heading, HStack, Text } from "@chakra-ui/react";
import { flushSync } from "react-dom";
import HeaderControls from "@/components/typing/HeaderArea/HeaderControls";
import { useSetPage, useSound } from "@/contexts/PageContext";
import type { HeaderAreaProps } from "@/types/index";

/**
 * ゲーム画面上部のヘッダー領域全体を構成するコンポーネント。
 * アプリケーションのタイトルと、ゲームの操作を行う `HeaderControls` をレイアウトします。
 *
 * @param props - コンポー-ネントのプロパティ。
 * @param props.title - ヘッダーに表示される現在のステージやページのタイトル。
 * @param props.start - ゲームを開始するためのコールバック関数。
 * @param props.stop - ゲームを停止するためのコールバック関数。
 * @param props.state - ゲームの現在の状態（開始済みか、終了済みかなど）を保持するオブジェクト。
 * @param props.setShouldPlay - BGMの再生状態を制御するためのセッター関数。
 * @param props.onOpen - 設定モーダルを開くためのコールバック関数。
 * @returns レンダリングされたヘッダーエリア。
 */
export default function HeaderArea({
	title,
	start,
	stop,
	state,
	setShouldPlay,
	onOpen,
}: HeaderAreaProps) {
	const setPage = useSetPage();
	const sound = useSound();

	const handleStart = () => {
		setShouldPlay(false);
		start();
	};

	const handleEscape = () => {
		stop("escape");
	};

	return (
		<HStack justify="space-between" h="40px">
			<Heading size="lg">
				<Text as="span" color="#1E90FF">
					ことば
				</Text>
				の
				<Text as="span" color="#E60033" fontWeight="bold">
					魔王
				</Text>
				と
				<Text as="span" color="#228B22">
					えいご
				</Text>
				の
				<Text as="span" color="#FFD700">
					勇者
				</Text>{" "}
				～{title}～
			</Heading>
			<HeaderControls
				started={state.started}
				finished={state.finished}
				onStart={handleStart}
				onEscape={handleEscape}
				onOpenSettings={onOpen}
				onBack={() => {
					if (sound) {
						flushSync(() => setShouldPlay(false));
					}
					setPage(0);
				}}
			/>
		</HStack>
	);
}
