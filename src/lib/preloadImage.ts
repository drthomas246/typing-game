import type { DecodableImage } from "@/types/index";

/**
 * 画像を事前に読み込みPromiseで完了を返す。
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
