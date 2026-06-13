import { lazy, Suspense, type ReactNode } from "react";
import { useHydrated } from "@tanstack/react-router";

const ClientWeb3Provider = lazy(() => import("./provider.client"));

export function Web3Provider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div suppressHydrationWarning />;
  }

  return (
    <Suspense fallback={<div suppressHydrationWarning />}>
      <ClientWeb3Provider>{children}</ClientWeb3Provider>
    </Suspense>
  );
}
