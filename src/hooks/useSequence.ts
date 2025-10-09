import { useAnimation } from "framer-motion";
import { useCallback, useState } from "react";
import { nextFrame, sleep } from "@/lib/nextFrame";
import { preloadImage } from "@/lib/preloadImage";
import type { Controls, useSequenceVisuals } from "@/types/index";

/**
 * タイトル画面やフェーズ切り替え時の視覚的なアニメーションシーケンスを制御するカスタムフック。
 * `framer-motion`を使用して、タイトル画像やスライドオーバーレイのアニメーションを管理します。
 *
 * @param {object} opts - アニメーションシーケンスのオプション設定。
 * @param {boolean} opts.firstPlayed - アプリケーションが初めて起動されたか、または初回プレイであるかを示すフラグ。
 * @param {string} opts.titleSrc - タイトル画像のソースパス。アニメーション前にプリロードされます。
 * @param {() => void} opts.onFinishFirst - 初回アニメーションが完了したときに呼び出されるコールバック関数。
 * @returns {object} 各アニメーションの可視性、アニメーション制御オブジェクト、およびシーケンス制御関数を含むオブジェクト。
 * @returns {object} .title - タイトル画像の表示状態とアニメーションコントロール。
 * @returns {boolean} .title.visible - タイトル画像が表示されているかどうか。
 * @returns {Controls} .title.ctrl - タイトル画像のアニメーションを制御する`framer-motion`のコントロール。
 * @returns {object} .top - 上部スライドオーバーレイの表示状態とアニメーションコントロール。
 * @returns {boolean} .top.visible - 上部スライドオーバーレイが表示されているかどうか。
 * @returns {Controls} .top.ctrl - 上部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。
 * @returns {object} .bottom - 下部スライドオーバーレイの表示状態とアニメーションコントロール。
 * @returns {boolean} .bottom.visible - 下部スライドオーバーレイが表示されているかどうか。
 * @returns {Controls} .bottom.ctrl - 下部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。
 * @returns {object} .right - 右部スライドオーバーレイの表示状態とアニメーションコントロール。
 * @returns {boolean} .right.visible - 右部スライドオーバーレイが表示されているかどうか。
 * @returns {Controls} .right.ctrl - 右部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。
 * @returns {object} .left - 左部スライドオーバーレイの表示状態とアニメーションコントロール。
 * @returns {boolean} .left.visible - 左部スライドオーバーレイが表示されているかどうか。
 * @returns {Controls} .left.ctrl - 左部スライドオーバーレイのアニメーションを制御する`framer-motion`のコントロール。
 * @returns {function(setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>): Promise<void>} .start - アニメーションシーケンスを開始する非同期関数。
 * @returns {function(): Promise<void>} .reset - アニメーションの状態を初期位置にリセットする非同期関数。
 */
export function useSequence(opts: {
	firstPlayed: boolean;
	titleSrc: string;
	onFinishFirst: () => void;
}) {
	const titleCtrl = useAnimation();
	const topCtrl = useAnimation();
	const bottomCtrl = useAnimation();
	const rightCtrl = useAnimation();
	const leftCtrl = useAnimation();

	const [vis, setVis] = useState<useSequenceVisuals>({
		title: true,
		top: true,
		bottom: true,
		right: true,
		left: true,
	});

	/**
	 * 全てのアニメーションコントロールを停止し、各オーバーレイの表示状態と位置を初期値にリセットする非同期関数。
	 *
	 * @returns {Promise<void>}
	 */
	const reset = useCallback(async () => {
		titleCtrl.stop();
		topCtrl.stop();
		bottomCtrl.stop();
		rightCtrl.stop();
		leftCtrl.stop();

		setVis({ title: true, top: true, bottom: true, right: true, left: true });

		await Promise.all([
			titleCtrl.set({ scale: 0, opacity: 0, display: "block" }),
			topCtrl.set({ x: 0, y: 0 }),
			bottomCtrl.set({ x: 0, y: 0 }),
			rightCtrl.set({ x: 0, y: 0 }),
			leftCtrl.set({ x: 0, y: 0 }),
		]);
	}, [titleCtrl, topCtrl, bottomCtrl, rightCtrl, leftCtrl]);

	/**
	 * アニメーションシーケンスを開始する非同期関数。
	 * 初回プレイ時のみ実行され、タイトル画像の表示、フェードアウト、
	 * そして各スライドオーバーレイの移動アニメーションを順次実行します。
	 * アニメーション完了後、ツールチップの表示をトリガーします。
	 *
	 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowTooltip - ツールチップの表示状態を更新するための関数。
	 * @returns {Promise<void>}
	 */
	const start = useCallback(
		async (setShowTooltip: React.Dispatch<React.SetStateAction<boolean>>) => {
			await reset();
			if (!opts.firstPlayed) return;

			await preloadImage(opts.titleSrc);
			await nextFrame();

			await titleCtrl.start({
				scale: 1,
				opacity: 1,
				transition: { duration: 0.9, ease: "easeOut" },
			});

			await sleep(2000);

			await titleCtrl.start({
				opacity: 0,
				transition: { duration: 0.8, ease: "easeInOut" },
			});
			await titleCtrl.set({ display: "none" });
			setVis((v) => ({ ...v, title: false }));

			await topCtrl.start({
				y: "-100%",
				transition: { duration: 1.5, ease: "easeInOut" },
			});
			setVis((v) => ({ ...v, top: false }));

			await bottomCtrl.start({
				y: "100%",
				transition: { duration: 1.0, ease: "easeInOut" },
			});
			setVis((v) => ({ ...v, bottom: false }));

			await rightCtrl.start({
				x: "100%",
				transition: { duration: 1.0, ease: "easeInOut" },
			});
			setVis((v) => ({ ...v, right: false }));

			await leftCtrl.start({
				x: "-100%",
				transition: { duration: 1.0, ease: "easeInOut" },
			});
			setVis((v) => ({ ...v, left: false }));

			setShowTooltip(true);

			opts.onFinishFirst();
		},
		[opts, reset, titleCtrl, topCtrl, bottomCtrl, rightCtrl, leftCtrl],
	);

	return {
		title: { visible: vis.title, ctrl: titleCtrl as Controls },
		top: { visible: vis.top, ctrl: topCtrl as Controls },
		bottom: { visible: vis.bottom, ctrl: bottomCtrl as Controls },
		right: { visible: vis.right, ctrl: rightCtrl as Controls },
		left: { visible: vis.left, ctrl: leftCtrl as Controls },
		start,
		reset,
	};
}
