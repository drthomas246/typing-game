import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRandomAssets } from "@/hooks/typingPage/useRandomAssets";

function mockRandomSequence(seq: number[]) {
  let i = 0;
  return vi.spyOn(Math, "random").mockImplementation(() => {
    const v = seq[i] ?? seq[seq.length - 1] ?? 0;
    i += 1;
    return v;
  });
}

describe("useRandomAssets", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("乱数列 [0.0, 0.0] → enemy=slime, background=0", async () => {
    const spy = mockRandomSequence([0.0, 0.0]);

    const { result } = renderHook(() => useRandomAssets());

    await waitFor(() => {
      expect(result.current.enemyImg).toBe("./images/monster/slime.png");
      expect(result.current.backgroundImg).toBe("./images/background/0.png");
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("乱数列 [0.66, 0.99] → enemy=goblin, background=2", async () => {
    const spy = mockRandomSequence([0.66, 0.99]);

    const { result } = renderHook(() => useRandomAssets());

    await waitFor(() => {
      expect(result.current.enemyImg).toBe("./images/monster/goblin.png");
      expect(result.current.backgroundImg).toBe("./images/background/2.png");
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("マウント後に再レンダーしても再計算されず、Math.random() は2回のまま", async () => {
    const spy = mockRandomSequence([0.5, 0.5]);

    const { result, rerender } = renderHook(() => useRandomAssets());

    await waitFor(() => {
      expect(result.current.enemyImg).toBe("./images/monster/goblin.png");
      expect(result.current.backgroundImg).toBe("./images/background/1.png");
    });
    expect(spy).toHaveBeenCalledTimes(2);

    rerender();

    expect(result.current.enemyImg).toBe("./images/monster/goblin.png");
    expect(result.current.backgroundImg).toBe("./images/background/1.png");
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
