import { lazy, Suspense, type ReactNode } from "react";
import { createClientOnlyFn } from "@tanstack/react-start";
import { useHydrated } from "@tanstack/react-router";

const loadClientWeb3Provider = createClientOnlyFn(() => import("./provider.client"));
const ClientWeb3Provider = lazy(loadClientWeb3Provider);

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
