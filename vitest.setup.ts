import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "fake-indexeddb/auto";

afterEach(() => cleanup());

Object.defineProperty(global, "speechSynthesis", {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: () => [],
  },
  writable: true,
});

class FakeImage {
  onload: null | (() => void) = null;
  onerror: null | ((e?: any) => void) = null;
  set src(_v: string) {
    queueMicrotask(() => this.onload && this.onload());
  }
}
vi.stubGlobal("Image", FakeImage);
