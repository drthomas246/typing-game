import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ColorModeProviderProps } from "@/types/index";
import { ColorModeProvider } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider {...props} />
		</ChakraProvider>
	);
}
