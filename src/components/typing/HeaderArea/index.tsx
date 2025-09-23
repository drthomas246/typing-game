import { Heading, HStack, Text } from "@chakra-ui/react";
import { flushSync } from "react-dom";
import HeaderControls from "@/components/typing/HeaderArea/HeaderControls";
import { useSetPage, useSound } from "@/contexts/PageContext";
import type { HeaderAreaProps } from "@/types/index";

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
