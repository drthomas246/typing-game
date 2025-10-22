import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import SettingsDrawer from "@/components/typing/SettingsDrawer";
import { renderWithProviders } from "../utils/renderWithProviders";

beforeAll(() => {
  if (!(global as any).ResizeObserver) {
    (global as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

describe("SettingsDrawer", () => {
  it("open=true でダイアログが表示される", async () => {
    const onClose = vi.fn();
    const onChange = vi.fn(); // ★ 追加

    renderWithProviders(
      <SettingsDrawer
        open={true}
        onClose={onClose}
        onChange={onChange} // ★ 追加
        settings={{ language: "english", learnThenRecall: true }}
      />,
      { kind: "real" },
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("×ボタンで onClose が呼ばれる", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onChange = vi.fn(); // ★ 追加

    renderWithProviders(
      <SettingsDrawer
        open
        onClose={onClose}
        onChange={onChange} // ★ 追加
        settings={{ language: "english", learnThenRecall: true }}
      />,
    );

    const closeBtn = await screen.findByRole("button", { name: /close/i });
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("open=false なら DOM に存在しない", () => {
    const onClose = vi.fn();
    const onChange = vi.fn(); // ★ 追加

    renderWithProviders(
      <SettingsDrawer
        open={false}
        onClose={onClose}
        onChange={onChange} // ★ 追加
        settings={{ language: "english", learnThenRecall: true }}
      />,
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("オーバーレイクリックで onClose が呼ばれる（存在すれば）", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onChange = vi.fn(); // ★ 追加

    renderWithProviders(
      <SettingsDrawer
        open
        onClose={onClose}
        onChange={onChange} // ★ 追加
        settings={{ language: "english", learnThenRecall: true }}
      />,
    );

    const overlay = document.querySelector(
      ".chakra-modal__overlay",
    ) as HTMLElement | null;
    if (overlay) {
      await user.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });
});
