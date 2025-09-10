import type { InputCaptureProps } from "@/types/index";
import { useEffect } from "react";

export default function InputCapture({
  onKey,
  enabled = true,
  handleEnter = true,
  handleBackspace = true,
  handleSpace = true,
  handleTab = true,
}: InputCaptureProps) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (!enabled) return;

      if (handleTab && e.key === "Tab") {
        onKey("\t", e);
        e.preventDefault();
        return;
      }
      if (handleSpace && (e.key === " " || e.code === "Space")) {
        onKey(" ", e);
        e.preventDefault();
        return;
      }
      if (e.key.length === 1) {
        onKey(e.key, e);
        e.preventDefault();
        return;
      }
      if (handleBackspace && e.key === "Backspace") {
        onKey("\b", e);
        e.preventDefault();
        return;
      }
      if (handleEnter && e.key === "Enter") {
        onKey("\n", e);
        e.preventDefault();
        return;
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () =>
      window.removeEventListener("keydown", handler, { capture: true });
  }, [onKey, enabled, handleEnter, handleBackspace, handleSpace, handleTab]);

  return null;
}
