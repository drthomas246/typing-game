import { Box, Text } from "@chakra-ui/react";
import AnswerInputView from "@/components/typing/AnswerArea/AnswerInputView";
import InputCapture from "@/components/typing/AnswerArea/InputCapture";
import type { AnswerPanelProps } from "@/types/index";

/**
 * タイピングの回答エリア全体を構成するメインコンポーネント。
 * ユーザー入力の視覚的表示を担当する `AnswerInputView` と、
 * キーボード入力のロジックを担当する `InputCapture` を組み合わせています。
 * また、ユーザーへの操作説明も表示します。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.typed - ユーザーが入力した文字列。
 * @param props.correctMap - 入力された各文字の正誤を示す真偽値の配列。
 * @param props.answer - 正解の文字列。
 * @param props.showHint - ヒントの表示を制御するフラグ。
 * @param props.state - ゲームエンジンの現在の状態（例: `started`, `finished`）。
 * @param props.inputOnKey - ユーザーのキー入力を処理するためのコールバック関数。
 * @param props.resultOpen - 結果画面が開いているかどうかを示すフラグ。入力無効化に使用。
 * @param props.engine - ゲームを開始または停止するために使用されるゲームエンジンインスタンス。
 * @returns レンダリングされた回答パネルコンポーネント。
 */
export default function AnswerPanel({
	typed,
	correctMap,
	answer,
	showHint,
	state,
	inputOnKey,
	resultOpen,
	engine,
}: AnswerPanelProps) {
	return (
		<>
			<Box p="4" rounded="xl" borderWidth="1px" bg="bg.panel" h="109px">
				<AnswerInputView
					typed={typed}
					correctMap={correctMap}
					answer={answer}
					showHint={showHint}
				/>
				<Text mt="2" fontSize="sm" color="fg.muted">
					スペースキー: 次のたん語 / エンターキー: はじめる、おわる / バックスペースキー: 1文字消す
					/ タブキー: ヒント
				</Text>
			</Box>

			<InputCapture
				enabled={!state.finished && !resultOpen}
				onKey={(ch, e) => {
					if (ch === "\n") {
						e.preventDefault();
						if (!state.started) {
							engine.start();
						} else if (!state.finished) {
							engine.stop();
							return;
						}
					}
					inputOnKey(ch);
				}}
			/>
		</>
	);
}
