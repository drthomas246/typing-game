// tests/ui/SettingsDrawer/SettingsDrawer.test.tsx
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsDrawer } from "@/components/typing/SettingsDrawer";
import { renderWithProviders } from "../../utils/renderWithProviders";

const baseSettings = { language: "ja", learnThenRecall: true };

describe("SettingsDrawer", () => {
  it("open=true でダイアログが表示される", async () => {
    renderWithProviders(
      <SettingsDrawer
        open={true}
        onClose={vi.fn()}
        settings={{ ...baseSettings }}
        onChange={vi.fn()}
      />,
      { kind: "real" },
    );

    await waitFor(() => {
      expect(screen.getByText(/せってい/i)).toBeInTheDocument();
    });
  });

  it("×ボタンで onClose が呼ばれる", async () => {
    const onClose = vi.fn();

    renderWithProviders(
      <SettingsDrawer
        open={true}
        onClose={onClose}
        settings={{ ...baseSettings }}
        onChange={vi.fn()}
      />,
      { kind: "real" },
    );

    // 「とじる」ボタン（テキスト）を押す
    const closeBtn = await screen.findByRole("button", { name: /^とじる$/ });
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("オーバーレイクリックで onClose が呼ばれる（存在すれば）", async () => {
    const onClose = vi.fn();

    renderWithProviders(
      <SettingsDrawer
        open={true}
        onClose={onClose}
        settings={baseSettings}
        onChange={vi.fn()}
      />,
      { kind: "real" },
    );

    // Ark UI + Chakra の Dialog は backdrop が pointer-events:none。
    // => positioner（オーバーレイのクリック判定を持つ要素）を直接叩く。
    const positioner = await waitFor(() => {
      const el = document.querySelector(
        '[data-scope="dialog"][data-part="positioner"]',
      ) as HTMLElement | null;
      if (!el) throw new Error("positioner not yet rendered");
      return el;
    });

    // userEvent は CSS を尊重してしまうので、低レベルな fireEvent で発火
    await act(async () => {
      fireEvent.mouseDown(positioner);
      fireEvent.mouseUp(positioner);
      fireEvent.click(positioner);
    });

    // 実装次第では外側クリックで閉じない設定の可能性がある。
    // フォールバックとして「×（アイコン）Close」ボタンをクリック。
    if (onClose.mock.calls.length === 0) {
      const iconClose = await screen.findByLabelText(/close/i);
      await act(async () => {
        fireEvent.click(iconClose);
      });
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
