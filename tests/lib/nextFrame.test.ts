import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextFrame, sleep } from "@/lib/nextFrame";

// ==== 型宣言（any を排除） ====
type RAF = (callback: FrameRequestCallback) => number;
type CAF = (handle: number) => void;

interface RafEnv {
  requestAnimationFrame?: RAF;
  cancelAnimationFrame?: CAF;
  performance: Performance;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
}

describe("nextFrame / sleep", () => {
  const g = globalThis as unknown as RafEnv;

  let originalRaf: RAF | undefined;
  let originalCaf: CAF | undefined;

  beforeEach(() => {
    vi.useFakeTimers();

    // オリジナル退避
    originalRaf = g.requestAnimationFrame;
    originalCaf = g.cancelAnimationFrame;

    // rAF を安定動作するポリフィルに差し替え（16ms 後に実行）
    let idSeq = 0;
    const scheduled = new Map<number, () => void>();

    const rafMock: RAF = vi.fn((cb: FrameRequestCallback) => {
      const id = ++idSeq;
      const wrapped = () => cb(g.performance.now());
      scheduled.set(id, wrapped);
      // setTimeout 0 だと他のタイマーと競合しやすいので 16ms に寄せる
      g.setTimeout(() => {
        const fn = scheduled.get(id);
        scheduled.delete(id);
        fn?.();
      }, 16);
      return id;
    });

    const cafMock: CAF = vi.fn((id: number) => {
      scheduled.delete(id);
    });

    g.requestAnimationFrame = rafMock;
    g.cancelAnimationFrame = cafMock;
  });

  afterEach(() => {
    // 復元（存在しなかった場合は削除）
    if (originalRaf) {
      (g.requestAnimationFrame as RAF | undefined) = originalRaf;
    } else {
      delete g.requestAnimationFrame;
    }

    if (originalCaf) {
      (g.cancelAnimationFrame as CAF | undefined) = originalCaf;
    } else {
      delete g.cancelAnimationFrame;
    }

    vi.useRealTimers();
  });

  it("nextFrame: 次フレームで解決される（rAF 1回呼ばれる）", async () => {
    const p = nextFrame();

    // rAF が一度は登録されている
    expect(g.requestAnimationFrame).toBeDefined();
    expect(g.requestAnimationFrame).toHaveBeenCalledTimes(1);

    // 16ms 進めると解決
    const settled = vi.fn();
    void p.then(settled);
    await vi.advanceTimersByTimeAsync(16);
    expect(settled).toHaveBeenCalledTimes(1);
  });

  it("nextFrame: 連続で2回 await すると2フレーム必要", async () => {
    const marks: string[] = [];

    const task = (async () => {
      await nextFrame();
      marks.push("f1");
      await nextFrame();
      marks.push("f2");
    })();

    // 1フレーム進めると1つ目だけ
    await vi.advanceTimersByTimeAsync(16);
    expect(marks).toEqual(["f1"]);

    // さらに1フレームで2つ目
    await vi.advanceTimersByTimeAsync(16);
    expect(marks).toEqual(["f1", "f2"]);

    await task; // 型上の完了待ち
  });

  it("sleep: 指定ms経過前は未解決、経過後に解決", async () => {
    const p = sleep(250);
    const settled = vi.fn();
    void p.then(settled);

    await vi.advanceTimersByTimeAsync(200);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(50);
    expect(settled).toHaveBeenCalledTimes(1);
  });

  it("sleep と nextFrame の組み合わせ: 時間→フレームの順に解決", async () => {
    const order: string[] = [];

    const task = (async () => {
      await sleep(30);
      order.push("sleep");
      await nextFrame();
      order.push("frame");
    })();

    // まずは時間経過だけ進める
    await vi.advanceTimersByTimeAsync(30);
    expect(order).toEqual(["sleep"]);

    // 次にフレームを進める
    await vi.advanceTimersByTimeAsync(16);
    expect(order).toEqual(["sleep", "frame"]);

    await task;
  });
});
