// biome-ignore-all lint/suspicious/noArrayIndexKey: このファイルは表示順が固定のため index key を許容

import { Box } from "@chakra-ui/react";
import type { AnswerInputViewProps } from "@/types/index";

/**
 * ユーザーの入力文字とヒントを色分けして表示するビューコンポーネント。
 * 入力された文字の正誤や、ヒント表示の有無に応じて、各文字のスタイルを動的に変更します。
 *
 * @param props - コンポーネントのプロパティ。
 * @param props.typed - ユーザーが現在までに入力した文字列。
 * @param props.correctMap - 入力された各文字が正解かどうかを示す真偽値の配列。
 * @param props.answer - 正解の文字列。
 * @param props.showHint - 未入力部分をヒントとして表示するかどうかを制御するフラグ。
 * @returns レンダリングされた入力表示ビュー。
 */
export default function AnswerInputView({
	typed,
	correctMap,
	answer,
	showHint,
}: AnswerInputViewProps) {
	const last = typed.length - 1;
	const displayChars = showHint ? answer.split("") : typed.split("");

	return (
		<Box
			fontFamily="mono"
			fontSize={{ base: "lg", md: "2xl" }}
			lineHeight="1.8"
			wordBreak="break-word"
			h="45px"
		>
			{displayChars.map((ch, i) => {
				if (!showHint) {
					if (typed.length === 0) return null;
					if (i >= typed.length) return null;

					if (i === last) {
						const color = correctMap[i] ? "blue.solid" : "red.solid";
						return (
							<Box as="span" key={i} color={color} whiteSpace="pre">
								{typed[i]}
							</Box>
						);
					}
					const color = correctMap[i] ? "fg" : "red.solid";
					return (
						<Box as="span" key={i} color={color} whiteSpace="pre">
							{typed[i]}
						</Box>
					);
				}

				if (i < typed.length) {
					if (i === last) {
						const color = correctMap[i] ? "blue.solid" : "red.solid";
						return (
							<Box as="span" key={i} color={color} whiteSpace="pre">
								{typed[i]}
							</Box>
						);
					}

					const color = correctMap[i] ? "fg" : "red.solid";
					return (
						<Box as="span" key={i} color={color} whiteSpace="pre">
							{typed[i]}
						</Box>
					);
				} else {
					return (
						<Box as="span" key={i} color="gray.focusRing" whiteSpace="pre">
							{ch}
						</Box>
					);
				}
			})}

			{typed.length === 0 && !showHint && (
				<Box as="span" color="fg.muted">
					(こたえのスペルをにゅうりょくしてね)
				</Box>
			)}
		</Box>
	);
}
