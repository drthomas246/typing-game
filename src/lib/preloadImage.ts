import type { DecodableImage } from "@/types/index";

/**
 * 指定されたURLの画像を事前に読み込み、読み込み完了または失敗時に解決されるPromiseを返す非同期関数。
 * `Image.decode()`をサポートするブラウザではこれを利用し、そうでない場合は`onload`/`onerror`イベントを使用します。
 * 画像の描画パフォーマンスを向上させるために、実際に表示する前に画像をキャッシュする目的で使用されます。
 *
 * @param {string} src - 読み込む画像のURLパス。
 * @returns {Promise<void>} 画像の読み込みが完了または失敗したときに解決されるPromise。
 */
export async function preloadImage(src: string): Promise<void> {
	await new Promise<void>((resolve) => {
		const img: DecodableImage = document.createElement("img");
		img.src = src;
		if (typeof img.decode === "function") {
			img
				.decode()
				.then(() => resolve())
				.catch(() => resolve());
		} else {
			img.onload = () => resolve();
			img.onerror = () => resolve();
		}
	});
}
