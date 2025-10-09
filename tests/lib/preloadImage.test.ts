import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { preloadImage } from "@/lib/preloadImage";

type MockImgDecode = {
  src: string;
  decode: () => Promise<void>;
  onload?: (() => void) | null;
  onerror?: (() => void) | null;
};

type MockImgNoDecode = {
  src: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
};

describe("preloadImage", () => {
  const originalCreateElement = document.createElement;

  beforeEach(() => {
    vi.restoreAllMocks(); // 念のため
  });

  afterEach(() => {
    // 念のため原状復帰（vi.restoreAllMocks() でも戻るが明示的に）
    document.createElement = originalCreateElement;
  });

  it("decode 対応ブラウザ: decode() が resolve しても Promise が resolve される", async () => {
    const mockImg: MockImgDecode = {
      src: "",
      decode: vi.fn().mockResolvedValue(undefined),
      onload: null,
      onerror: null,
    };

    const spy = vi
      .spyOn(document, "createElement")
      // @ts-expect-error force return mock img
      .mockImplementation((tag: string) =>
        tag === "img" ? mockImg : originalCreateElement(tag),
      );

    await expect(preloadImage("/path/to/a.png")).resolves.toBeUndefined();

    expect(spy).toHaveBeenCalledWith("img");
    expect(mockImg.decode).toHaveBeenCalledTimes(1);
    expect(mockImg.src).toBe("/path/to/a.png");
  });

  it("decode 対応ブラウザ: decode() が reject しても Promise は resolve される（内部で catch→resolve）", async () => {
    const mockImg: MockImgDecode = {
      src: "",
      decode: vi.fn().mockRejectedValue(new Error("decode failed")),
      onload: null,
      onerror: null,
    };

    vi.spyOn(document, "createElement")
      // @ts-expect-error force return mock img
      .mockImplementation((tag: string) =>
        tag === "img" ? mockImg : originalCreateElement(tag),
      );

    await expect(preloadImage("/path/to/b.png")).resolves.toBeUndefined();
    expect(mockImg.decode).toHaveBeenCalledTimes(1);
    expect(mockImg.src).toBe("/path/to/b.png");
  });

  it("decode 非対応ブラウザ: onload で resolve", async () => {
    const mockImg: MockImgNoDecode = {
      src: "",
      onload: null,
      onerror: null,
    };

    vi.spyOn(document, "createElement")
      // @ts-expect-error force return mock img
      .mockImplementation((tag: string) =>
        tag === "img" ? mockImg : originalCreateElement(tag),
      );

    // preloadImage を開始（この時点で onload/onerror がセットされる）
    const p = preloadImage("/path/to/c.png");

    // ハンドラが設定されたことを確認
    expect(typeof mockImg.onload).toBe("function");
    expect(typeof mockImg.onerror).toBe("function");

    // onload を発火 → resolve されるはず
    mockImg.onload?.();

    await expect(p).resolves.toBeUndefined();
    expect(mockImg.src).toBe("/path/to/c.png");
  });

  it("decode 非対応ブラウザ: onerror でも resolve", async () => {
    const mockImg: MockImgNoDecode = {
      src: "",
      onload: null,
      onerror: null,
    };

    vi.spyOn(document, "createElement")
      // @ts-expect-error force return mock img
      .mockImplementation((tag: string) =>
        tag === "img" ? mockImg : originalCreateElement(tag),
      );

    const p = preloadImage("/path/to/d.png");

    expect(typeof mockImg.onload).toBe("function");
    expect(typeof mockImg.onerror).toBe("function");

    // 失敗をシミュレートしても resolve 仕様
    mockImg.onerror?.();

    await expect(p).resolves.toBeUndefined();
    expect(mockImg.src).toBe("/path/to/d.png");
  });
});
