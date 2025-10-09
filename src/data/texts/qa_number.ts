import type { QAPair } from "@/types/index";

/**
 * 1から10までの数字の名称（日本語と英語）と、それに対応する画像パスをまとめた問題データの配列。
 * 各オブジェクトは `QAPair` 型に準拠し、タイピングゲームで使用される問いと答えのペアを表します。
 *
 * @type {QAPair[]}
 * @property {string} ja - 日本語の数字（例: "1"）。
 * @property {string} en - 英語の数字（例: "one"）。タイピングの解答として使用されます収録したデータ。
 */
const QA_NUMBER: QAPair[] = [
	{ ja: "1", en: "one", img: "./images/number/number_1.png" },
	{ ja: "2", en: "two", img: "./images/number/number_2.png" },
	{ ja: "3", en: "three", img: "./images/number/number_3.png" },
	{ ja: "4", en: "four", img: "./images/number/number_4.png" },
	{ ja: "5", en: "five", img: "./images/number/number_5.png" },
	{ ja: "6", en: "six", img: "./images/number/number_6.png" },
	{ ja: "7", en: "seven", img: "./images/number/number_7.png" },
	{ ja: "8", en: "eight", img: "./images/number/number_8.png" },
	{ ja: "9", en: "nine", img: "./images/number/number_9.png" },
	{ ja: "10", en: "ten", img: "./images/number/number_10.png" },
];

export default QA_NUMBER;
