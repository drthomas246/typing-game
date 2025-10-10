import type { StoryDefault, Story } from "@ladle/react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import AnswerPanel from "@/components/typing/AnswerArea"; // index.tsx の default export
// ↑ 実際の配置が "@/compornents/..." であればインポートも合わせて修正してください。

type EngineMock = {
  start: () => void;
  stop: () => void;
};

type EngineStateMock = {
  started: boolean;
  finished: boolean;
};

function useAnswerDemo(initialAnswer = "apple") {
  const [answer] = useState(initialAnswer);
  const [typed, setTyped] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const state: EngineStateMock = useMemo(
    () => ({ started, finished }),
    [started, finished],
  );

  // 正誤マップを単純比較で作成（typed の長さまで）
  const correctMap = useMemo(() => {
    const arr: boolean[] = [];
    for (let i = 0; i < typed.length; i++) {
      arr.push(typed[i] === answer[i]);
    }
    return arr;
  }, [typed, answer]);

  // Ladle 上でのキー入力処理デモ
  const inputOnKey = (ch: string) => {
    if (finished) return;
    if (ch === " ") {
      // 次の単語（演出用）：typed リセット
      setTyped("");
      return;
    }
    if (ch === "\b") {
      setTyped((s) => s.slice(0, -1));
      return;
    }
    if (ch.length === 1 && /^[a-zA-Z]$/.test(ch)) {
      setTyped((s) => (s + ch).toLowerCase());
    }
  };

  const engine: EngineMock = {
    start: () => {
      setStarted(true);
      setFinished(false);
    },
    stop: () => {
      setFinished(true);
    },
  };

  const reset = () => {
    setTyped("");
    setShowHint(false);
    setResultOpen(false);
    setStarted(false);
    setFinished(false);
  };

  return {
    typed,
    correctMap,
    answer,
    showHint,
    state,
    inputOnKey,
    resultOpen,
    engine,
    setShowHint,
    setResultOpen,
    reset,
  };
}

export default {
  title: "Components/typing/AnswerArea",
} satisfies StoryDefault;

export const Basic: Story = () => {
  const demo = useAnswerDemo("apple");

  return (
    <Box p="6">
      {/* spacing -> gap / isDisabled -> disabled */}
      <HStack gap="2" mb="3">
        <Button size="sm" onClick={() => demo.engine.start()}>
          開始 (engine.start)
        </Button>
        <Button
          size="sm"
          onClick={() => demo.engine.stop()}
          disabled={!demo.state.started || demo.state.finished}
        >
          終了 (engine.stop)
        </Button>
        <Button size="sm" onClick={() => demo.setShowHint((v) => !v)}>
          ヒント切替
        </Button>
        <Button size="sm" onClick={() => demo.setResultOpen((v) => !v)}>
          結果ダイアログ切替
        </Button>
        <Button size="sm" variant="outline" onClick={demo.reset}>
          リセット
        </Button>
      </HStack>

      <Text fontSize="sm" mb="2">
        デモ用 Answer: <b>{demo.answer}</b> / typed: <b>{demo.typed}</b> /
        started: {String(demo.state.started)} / finished:{" "}
        {String(demo.state.finished)} / resultOpen: {String(demo.resultOpen)} /
        hint: {String(demo.showHint)}
      </Text>

      <AnswerPanel
        typed={demo.typed}
        correctMap={demo.correctMap}
        answer={demo.answer}
        showHint={demo.showHint}
        state={demo.state as any}
        inputOnKey={demo.inputOnKey}
        resultOpen={demo.resultOpen}
        engine={demo.engine as any}
      />
    </Box>
  );
};
