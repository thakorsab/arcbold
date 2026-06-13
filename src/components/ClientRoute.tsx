import { lazy, Suspense, type ComponentType, useEffect } from "react";
import { useHydrated, useRouter } from "@tanstack/react-router";

import { reportLovableError } from "../lib/lovable-error-reporting";

export function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="h-10 w-10 rounded-full border-2 border-[#FF6B00]/30 border-t-[#FF6B00] animate-spin shadow-[0_0_24px_rgba(255,107,0,0.45)]" />
    </div>
  );
}

export function createClientOnlyRoute(load: () => Promise<{ default: ComponentType }>) {
  const LazyRoute = lazy(load);

  return function ClientOnlyRoute() {
    const hydrated = useHydrated();

    if (!hydrated) return <RouteLoading />;

    return (
      <Suspense fallback={<RouteLoading />}>
        <LazyRoute />
      </Suspense>
    );
  };
}

export function RouteErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "page_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 relative z-10">
      <div className="text-center max-w-md">
        <h1 className="font-display text-2xl font-black text-white">Something broke</h1>
        <p className="mt-2 text-sm text-[#8892A4]">An unexpected error occurred. Please try again.</p>
        {import.meta.env.DEV && (
          <p className="mt-2 text-xs text-[#8892A4]/60 font-mono break-all">{error.message}</p>
        )}
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 btn-neon-orange"
        >
          Try again
        </button>
      </div>
    </div>
  );
}