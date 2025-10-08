/**
 * ブラウザの次回の描画サイクル（アニメーションフレーム）まで待機する非同期関数。
 * UIの更新が反映されるのを待ってから次の処理を実行したい場合などに使用されます。
 *
 * @returns {Promise<void>} 次のアニメーションフレームで解決されるPromise。
 */
export const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * 指定されたミリ秒数だけ処理を遅延させる非同期関数。
 * アニメーションの一時停止や、時間差のある処理を実行したい場合に使用されます。
 *
 * @param {number} ms - 遅延させるミリ秒数。
 * @returns {Promise<void>} 指定されたミリ秒後に解決されるPromise。
 */
export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
