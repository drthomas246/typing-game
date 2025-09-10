import HeaderControls from "@/components/typing/HeaderArea/HeaderControls";
import type { HeaderAreaProps } from "@/types/index";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { useSetPage } from "@/contexts/PageContext";
import { flushSync } from "react-dom";
import { useSound } from "@/contexts/PageContext";

export default function HeaderArea({
  title,
  start,
  stop,
  state,
  setShouldPlay,
  settings,
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
        learningMode={settings.learningMode}
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
