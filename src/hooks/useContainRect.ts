import { type RefObject, useCallback, useEffect, useState } from "react";
import type { ContainRect } from "@/types/index";

/**
 * 画像を親要素の領域内に「包含 (contain)」するように配置するための矩形情報 (x, y, width, height) を計算するカスタムフック。
 * レスポンシブな画像表示や、特定の領域に画像をフィットさせる際に使用されます。
 *
 * @param {RefObject<HTMLImageElement | null>} imgRef - 描画対象のHTMLImageElementへのReact参照オブジェクト。`naturalWidth`や`naturalHeight`を取得するために使用されます。
 * @param {RefObject<HTMLDivElement | null>} wrapRef - 画像を包含する親HTMLDivElementへのReact参照オブジェクト。`clientWidth`や`clientHeight`を取得するために使用されます。
 * @returns {{ rect: ContainRect; compute: () => void }} 計算された矩形情報と再計算関数を含むオブジェクト。
 * @returns {ContainRect} .rect - 画像を包含するための計算されたx, y座標と幅、高さ。
 * @returns {() => void} .compute - 矩形情報を手動で再計算するためのコールバック関数。
 */
export function useContainRect(
  imgRef: RefObject<HTMLImageElement | null>,
  wrapRef: RefObject<HTMLDivElement | null>,
) {
  const [rect, setRect] = useState<ContainRect>({ x: 0, y: 0, w: 0, h: 0 });

  const compute = useCallback(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || !img.naturalWidth || !img.naturalHeight) return;

    const cw = wrap.clientWidth;
    const ch = wrap.clientHeight;
    const rImg = img.naturalWidth / img.naturalHeight;
    const rCon = cw / ch;

    let w = 0,
      h = 0,
      x = 0,
      y = 0;
    if (rCon > rImg) {
      h = ch;
      w = h * rImg;
      x = (cw - w) / 2;
      y = 0;
    } else {
      w = cw;
      h = w / rImg;
      x = 0;
      y = (ch - h) / 2;
    }
    setRect({ x, y, w, h });
  }, [imgRef, wrapRef]);

  useEffect(() => {
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [compute]);

  return { rect, compute };
}
