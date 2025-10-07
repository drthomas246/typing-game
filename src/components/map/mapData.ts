import type { Tile } from "@/types/index";

/**
 * マップタイル1枚あたりの幅（ピクセル単位）。
 * @constant
 */
export const TILE_W = 1308;

/**
 * マップタイル1枚あたりの高さ（ピクセル単位）。
 * @constant
 */
export const TILE_H = 736;

/**
 * マップを構成するタイル情報の配列。
 * 各オブジェクトは、タイルの画像ソース、ワールド座標(x, y)、および寸法(w, h)を定義します。
 * 座標は、タイルのグリッド位置とタイルの固定寸法に基づいて計算されます。
 * `as const`アサーションにより、この配列とその内容が読み取り専用として扱われることが保証されます。
 * @type {ReadonlyArray<Tile>}
 */
export const tiles: ReadonlyArray<Tile> = [
  {
    src: "./images/map/map_01.webp",
    x: TILE_W * 0,
    y: TILE_H * 0,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_02.webp",
    x: TILE_W * 1,
    y: TILE_H * 0,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_03.webp",
    x: TILE_W * 2,
    y: TILE_H * 0,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_04.webp",
    x: TILE_W * 3,
    y: TILE_H * 0,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_05.webp",
    x: TILE_W * 0,
    y: TILE_H * 1,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_06.webp",
    x: TILE_W * 1,
    y: TILE_H * 1,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_07.webp",
    x: TILE_W * 2,
    y: TILE_H * 1,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_08.webp",
    x: TILE_W * 3,
    y: TILE_H * 1,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_09.webp",
    x: TILE_W * 0,
    y: TILE_H * 2,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_10.webp",
    x: TILE_W * 1,
    y: TILE_H * 2,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_11.webp",
    x: TILE_W * 2,
    y: TILE_H * 2,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_12.webp",
    x: TILE_W * 3,
    y: TILE_H * 2,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_13.webp",
    x: TILE_W * 0,
    y: TILE_H * 3,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_14.webp",
    x: TILE_W * 1,
    y: TILE_H * 3,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_15.webp",
    x: TILE_W * 2,
    y: TILE_H * 3,
    w: TILE_W,
    h: TILE_H,
  },
  {
    src: "./images/map/map_16.webp",
    x: TILE_W * 3,
    y: TILE_H * 3,
    w: TILE_W,
    h: TILE_H,
  },
] as const;

/**
 * タイルの配置情報から計算されたワールドマップ全体のサイズ。
 * この値は、マップのパン操作などのインタラクションにおける境界を定義するために使用されます。
 * @property {number} width - マップの総幅。
 * @property {number} height - マップの総高さ。
 */
export const worldSize = {
  width: Math.max(...tiles.map((t) => t.x + t.w)),
  height: Math.max(...tiles.map((t) => t.y + t.h)),
};
