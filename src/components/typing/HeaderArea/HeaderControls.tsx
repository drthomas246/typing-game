import type { HeaderControlsProps } from "@/types/index";
import { Button, HStack } from "@chakra-ui/react";
import { useBattle } from "@/contexts/PageContext";

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
