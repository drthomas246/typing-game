import { vi } from "vitest";

export type HowlOptions = {
  src: string[];
  loop?: boolean;
  volume?: number;
  html5?: boolean;
};

export const play = vi.fn<() => number>(() => 1);
export const stop = vi.fn<() => void>(() => {});
export const unload = vi.fn<() => void>(() => {});
export const fade = vi.fn<
  (from: number, to: number, durationMs: number) => void
>(() => {});
export const volume = vi.fn<(v?: number) => number>((v?: number) =>
  typeof v === "number" ? v : 0,
);
export const playing = vi.fn<() => boolean>(() => false);

export class Howl {
  opts: HowlOptions;

  constructor(opts: HowlOptions) {
    this.opts = opts;
  }

  play = play;
  stop = stop;
  unload = unload;
  fade = fade;
  volume = volume;
  playing = playing;

  on = vi.fn<(event: string, cb: (...args: unknown[]) => void) => void>(
    () => {},
  );
  off = vi.fn<(event?: string, cb?: (...args: unknown[]) => void) => void>(
    () => {},
  );
}

export default { Howl };
