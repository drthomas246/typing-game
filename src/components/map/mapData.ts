import type { Tile } from "@/types/index";

/**
 * マップ画像タイルの配置情報を定義する。
 */
export const TILE_W = 1308;
export const TILE_H = 736;

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

export const worldSize = {
  width: Math.max(...tiles.map((t) => t.x + t.w)),
  height: Math.max(...tiles.map((t) => t.y + t.h)),
};
