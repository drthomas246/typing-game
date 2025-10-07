import type { QAPair } from "@/types/index";

/**
 * ステップ1（初級）の語彙に関するタイピングゲームの問題データ配列。
 * 各要素は日本語の問い (`ja`)、対応する英語の答え (`en`)、
 * および関連する画像へのパス (`img`) を含む`QAPair`オブジェクトです。
 *
 * @type {QAPair[]}
 * @property {string} ja - 日本語の意味やフレーズ（例: "活動"）。
 * @property {string} en - 対応する英語の単語（例: "activity"）。タイピングの解答として使用されます。
 * @property {string} img - 単語に関連する画像ファイルへのパス。
 */
const QA_STEP1: QAPair[] = [
  {
    ja: "～について（の）/およそ、約",
    en: "about",
    img: "./images/step1/about.png",
  },
  { ja: "活動", en: "activity", img: "./images/step1/activity.png" },
  { ja: "～のあとに", en: "after", img: "./images/step1/after.png" },
  { ja: "午後", en: "afternoon", img: "./images/step1/afternoon.png" },
  {
    ja: "再び、もう一度、また",
    en: "again",
    img: "./images/step1/again.png",
  },
  {
    ja: "～に対抗して、反対して",
    en: "against",
    img: "./images/step1/against.png",
  },
  { ja: "年齢、時代", en: "age", img: "./images/step1/age.png" },
  {
    ja: "全ての/全く、すっかり",
    en: "all",
    img: "./images/step1/all.png",
  },
  { ja: "いつも、常に", en: "always", img: "./images/step1/always.png" },
  { ja: "～と･･･、そして", en: "and", img: "./images/step1/and.png" },
];

export default QA_STEP1;
