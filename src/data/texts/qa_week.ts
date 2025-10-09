import type { QAPair } from "@/types/index";

/**
 * 曜日の名称（日本語と英語）と、それに対応する画像パスをまとめた問題データの配列。
 * 各オブジェクトは `QAPair` 型に準拠し、タイピングゲームで使用される問いと答えのペアを表します。
 *
 * @type {QAPair[]}
 * @property {string} ja - 日本語の曜日名（例: "日曜日"）。
 * @property {string} en - 英語の曜日名（例: "sunday"）。タイピングの解答として使用されます。
 * @property {string} img - 曜日に関連する画像ファイルへのパス。
 */
const QA_WEEK: QAPair[] = [
	{ ja: "日曜日", en: "sunday", img: "./images/week/weekmark7.png" },
	{ ja: "月曜日", en: "monday", img: "./images/week/weekmark1.png" },
	{ ja: "火曜日", en: "tuesday", img: "./images/week/weekmark2.png" },
	{ ja: "水曜日", en: "wednesday", img: "./images/week/weekmark3.png" },
	{ ja: "木曜日", en: "thursday", img: "./images/week/weekmark4.png" },
	{ ja: "金曜日", en: "friday", img: "./images/week/weekmark5.png" },
	{ ja: "土曜日", en: "saturday", img: "./images/week/weekmark6.png" },
];

export default QA_WEEK;
