import { type RenderHookOptions, renderHook } from "@testing-library/react";
import type React from "react";
import PageProvider from "@/contexts/PageProvider";

/**
 * PageProvider を含めた renderHook のヘルパー。
 */
export function renderHookWithProviders<TProps, TResult>(
  cb: (initialProps: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PageProvider>{children}</PageProvider>
  );
  return renderHook(cb, { wrapper, ...options });
}
