/**
 * 次のアニメーションフレームまで待機する。
 */
export const nextFrame = () =>
        new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * 指定ミリ秒だけ遅延させる。
 */
export const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));
