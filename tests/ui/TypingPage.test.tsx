// tests/ui/TypingPage.test.tsx

import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageProvider from "@/contexts/PageProvider";
import { TypingPage } from "@/pages/TypingPage";
import { renderWithProviders } from "../utils/renderWithProviders";

// ★ MapView を完全モック（named & default の両方を提供）
vi.mock("@/components/map/MapView", () => {
  const Mock = () => <div data-testid="mock-map-view" />;
  return { __esModule: true, default: Mock, MapView: Mock };
});

const QA = [
  { ja: "犬", en: "dog" },
  { ja: "猫", en: "cat" },
];

describe("TypingPage (integration, with providers)", () => {
  it("PageProvider(実)でもクラッシュせず Map 画面（page=0想定）が出る", async () => {
    renderWithProviders(
      <PageProvider>
        <TypingPage QA={QA} title="テストタイトル" sound={false} />
      </PageProvider>,
      { kind: "real" },
    );

    // ✅ page=0 では Map 画面なので、タイトル文言ではなく Map のモックが見えることだけを確認
    await waitFor(() => {
      expect(screen.getByTestId("mock-map-view")).toBeInTheDocument();
    });
  });

  it("MockPageProviderで page=1 を指定すると、TypingPage が出てタイトルと質問領域が見える", async () => {
    renderWithProviders(
      <TypingPage QA={QA} title="テストタイトル" sound={false} />,
      {
        kind: "mock",
        initial: { page: 1 }, // ← MockPageState の形に合わせて渡す
      },
    );

    // page=1 は Typing 画面なので、タイトルや UI が見える
    await waitFor(() => {
      expect(screen.getByText(/テストタイトル/)).toBeInTheDocument();
      // 画面の主要要素のいずれかを確認（例: 「始める」ボタン等）
      expect(
        screen.getByRole("button", { name: /始める/ }),
      ).toBeInTheDocument();
    });
  });
});
