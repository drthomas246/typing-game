import { act, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import type React from "react";
import { describe, expect, it } from "vitest";
import { ResultsDialog } from "@/components/typing/ResultsDialog";
import { renderWithProviders } from "../../utils/renderWithProviders";

// --- Portal無効化モック ---
// （テスト実行中だけ、Ark UIのPortalを単なる子出力に置き換える）
vi.mock("@ark-ui/react", async () => {
  const actual = await vi.importActual<any>("@ark-ui/react");
  const PassthroughPortal = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );
  return { ...actual, Portal: PassthroughPortal };
});

describe("ResultsDialog has no a11y violations", () => {
  it("no obvious issues", async () => {
    // --- コンポーネント描画 ---
    renderWithProviders(
      <ResultsDialog
        open
        setOpen={() => {}}
        onRetry={() => {}}
        setShouldBgmPlay={() => {}}
        summary={{
          timeSec: 30,
          usedHintCount: 0,
          mistakeProblemCount: 2,
          killedNow: true,
        }}
      />,
      { kind: "real" }, // Chakra/Portalなどの依存を満たす
    );

    // --- ダイアログが出るまで待つ ---
    const dialog = await screen.findByRole("dialog");

    // --- axeによるa11y検査をactで安全に実行 ---
    let results: Awaited<ReturnType<typeof axe>>;
    await act(async () => {
      results = await axe(dialog);
    });

    // --- アクセシビリティ違反がないことを確認 ---
    expect(results!.violations).toHaveLength(0);
  }, 15000); // モーダル描画が重いので余裕を持たせる
});
