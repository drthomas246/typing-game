import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResultsDialog from "@/components/typing/ResultsDialog";
import { renderWithProviders } from "../../utils/renderWithProviders";

describe("ResultsDialog (P0)", () => {
	beforeEach(() => {
		// ★ FakeTimers の影響を遮断
		vi.useRealTimers();
	});

	it("open/close & onRetry & close-button", async () => {
		const user = userEvent.setup();
		const setOpen = vi.fn();
		const onRetry = vi.fn();

		const summary = {
			timeSec: 30,
			usedHintCount: 0,
			mistakeProblemCount: 2,
			killedNow: true,
		} as const;

		// 1回目: 表示 → とじる で閉じる（Escは不安定なので避ける）
		const r1 = renderWithProviders(
			<ResultsDialog
				open={true}
				setOpen={setOpen}
				onRetry={onRetry}
				setShouldBgmPlay={() => {}}
				summary={summary}
			/>,
			{ kind: "mock", initial: { sound: true, level: 1 } },
		);

		await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
		const dialog1 = screen.getByRole("dialog");
		const inDialog1 = within(dialog1);

		const close1 = inDialog1.getByRole("button", { name: /とじる/i });
		await user.click(close1);

		await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false));

		// 重複Portalを避けるため unmount
		r1.unmount();

		// 2回目: 表示 → 「もう一度やる」をクリック
		renderWithProviders(
			<ResultsDialog
				open={true}
				setOpen={setOpen}
				onRetry={onRetry}
				setShouldBgmPlay={() => {}}
				summary={summary}
			/>,
			{ kind: "mock", initial: { sound: true, level: 1 } },
		);

		await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
		const dialog2 = screen.getByRole("dialog");
		const inDialog2 = within(dialog2);

		const retry =
			inDialog2.queryByRole("button", { name: /(もう一度やる|再挑戦|retry)/i }) ??
			inDialog2.getAllByRole("button")[0]; // 最後の手段
		await user.click(retry as HTMLElement);

		expect(onRetry).toHaveBeenCalled();
	}, 15000); // ★ Windows/OneDrive 環境保険で延長
});
