// biome-ignore-all lint/suspicious/noArrayIndexKey: このファイルは表示順が固定のため index key を許容

import { Box } from "@chakra-ui/react";
import type { AnswerInputViewProps } from "@/types/index";

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
