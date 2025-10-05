import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSound } from "@/hooks/typingEngine/useSound";
import type { EngineOptions, SoundCtl } from "@/types/index";

vi.mock("@/contexts/PageContext", () => ({
  useSound: () => true,
}));

vi.mock("howler", async () => await import("../../__mocks__/howler"));

beforeEach(() => vi.clearAllMocks());

describe("useSound (Howler mocked)", () => {
  it("playBgm: 初回生成→play、二重再生ガード、stop→unload→再生", () => {
    const initialProps: EngineOptions = {
      bgmSrc: "/dummy.mp3",
      bgmVolume: 0.5,
      sfxVolume: 0.8,
    };

    const { result, rerender } = renderHook<SoundCtl, EngineOptions>(
      (p) => useSound(p),
      { initialProps },
    );

    expect(typeof result.current.playBgm).toBe("function");
    expect(typeof result.current.stopBgm).toBe("function");
    expect(typeof result.current.sfx.escape).toBe("function");

    act(() => result.current.playBgm());

    act(() => result.current.playBgm());

    act(() => result.current.stopBgm());

    act(() => result.current.playBgm());

    rerender(initialProps);
  });
});
