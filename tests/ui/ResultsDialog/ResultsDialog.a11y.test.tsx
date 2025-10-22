// tests/ui/ResultsDialog/ResultsDialog.a11y.test.tsx
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResultsDialog from "@/components/typing/ResultsDialog";
import { renderWithProviders } from "../../utils/renderWithProviders";

describe("ResultsDialog has no a11y violations", () => {
  beforeEach(() => {
    vi.useRealTimers(); // FakeTimersの影響を遮断
  });

  it("no obvious issues", async () => {
    const setOpen = vi.fn();
    const onRetry = vi.fn();

    const summary = {
      timeSec: 30,
      usedHintCount: 0,
      mistakeProblemCount: 2,
      killedNow: true,
    } as const;

    const { container } = renderWithProviders(
      <ResultsDialog
        open
        setOpen={setOpen}
        onRetry={onRetry}
        setShouldBgmPlay={() => {}}
        summary={summary}
      />,
      { kind: "real" }, // Chakra/Portal/Context依存を満たす
    );

    // dialogが描画されてからaxeに渡す
    await screen.findByRole("dialog");

    // ✅ どちらか一方の書き方を選択
    // 1) matcher拡張済みならこちら
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();

    // 2) 拡張なしでも動く素直な判定
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
