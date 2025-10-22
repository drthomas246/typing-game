import { vi } from "vitest";

const origError = console.error;

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((...args: any[]) => {
    const msg = String(args[0] ?? "");
    if (msg.includes("Unexpected return value from a callback ref")) return;
    origError(...args);
  });
});

afterAll(() => {
  (console.error as any).mockRestore?.();
});
