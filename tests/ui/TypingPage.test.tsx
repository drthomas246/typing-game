import { screen } from "@testing-library/react";
import TypingPage from "@/pages/TypingPage";
import type { QAPair } from "@/types";
import { renderWithProviders } from "../utils/renderWithProviders";

const QA: QAPair[] = [
  { ja: "いち", en: "one" },
  { ja: "に", en: "two" },
];

const TITLE = "テストステージ";

describe("TypingPage (integration, with providers)", () => {
  test("PageProvider(実)でもクラッシュせずタイトル画面が出る（page=0想定）", async () => {
    renderWithProviders(<TypingPage QA={QA} title={TITLE} sound={true} />, {
      kind: "real",
    });

    expect(
      await screen.findByAltText("ことばの魔王とえいごの勇者"),
    ).toBeInTheDocument();

    expect(screen.queryByText("バトル開始")).not.toBeInTheDocument();
  });

  test("MockPageProviderで page=1 を指定すると、TypingPage が出てタイトルと質問領域が見える", async () => {
    renderWithProviders(<TypingPage QA={QA} title={TITLE} sound={true} />, {
      kind: "mock",
      initial: {
        page: 1,
        battle: false,
        level: 1,
        sound: true,
        sort: false,
      },
    });

    const titleEls = await screen.findAllByText((_, node) =>
      (node?.textContent ?? "").includes(TITLE),
    );
    expect(titleEls.length).toBeGreaterThan(0);
    expect(titleEls[0]).toBeInTheDocument();
  });
});
