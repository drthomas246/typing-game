import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
export const Provider = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);
