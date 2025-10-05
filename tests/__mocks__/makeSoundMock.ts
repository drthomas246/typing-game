import { vi } from "vitest";
import type { SoundCtl } from "@/types";

export const makeSoundMock = (): SoundCtl => {
  const sfx = {
    slash: vi.fn(),
    punch: vi.fn(),
    defeat: vi.fn(),
    escape: vi.fn(),
    fallDown: vi.fn(),
    levelUp: vi.fn(),
    keyOn: vi.fn(),
    miss: vi.fn(),
    sentenceClear: vi.fn(),
  };

  const mock: SoundCtl = {
    sfx,
    playBgm: vi.fn(),
    stopBgm: vi.fn(),
  };

  return mock;
};

export const makeSoundMockStrict = () =>
  ({
    sfx: {
      slash: vi.fn(),
      punch: vi.fn(),
      defeat: vi.fn(),
      escape: vi.fn(),
      fallDown: vi.fn(),
      levelUp: vi.fn(),
      keyOn: vi.fn(),
    },
    playBgm: vi.fn(),
    stopBgm: vi.fn(),
  }) satisfies SoundCtl;
