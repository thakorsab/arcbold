import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Web3Provider } from "../lib/web3/provider";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ParticleNetwork } from "../components/ParticleNetwork";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative z-10">
      <div className="text-center">
        <h1 className="font-display text-8xl font-black text-gradient-bold">404</h1>
        <p className="mt-3 text-[#8892A4]">This page drifted off-chain.</p>
        <Link to="/" className="inline-block mt-6 btn-neon-orange">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative z-10">
      <div className="text-center max-w-md">
        <h1 className="font-display text-2xl font-black text-white">Something broke</h1>
        <p className="mt-2 text-sm text-[#8892A4]">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 btn-neon-orange"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ArcBold" },
      { name: "description", content: "Cross-currency lending protocol on Arc Testnet. Supply USDC, borrow EURC. Or flip it" },
      { property: "og:title", content: "ArcBold" },
      { property: "og:description", content: "Cross-currency lending protocol on Arc Testnet. Supply USDC, borrow EURC. Or flip it" },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#FF6B00" },
      { name: "twitter:title", content: "ArcBold" },
      { name: "twitter:description", content: "Cross-currency lending protocol on Arc Testnet. Supply USDC, borrow EURC. Or flip it" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e2830859-ccea-464c-876b-5fae6a7b59f4" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e2830859-ccea-464c-876b-5fae6a7b59f4" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=Orbitron:wght@500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <div className="relative min-h-screen flex flex-col">
          <ParticleNetwork />
          <div className="vignette" />
          <div className="scanline" />
          <Navbar />
          <main className="relative z-10 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </Web3Provider>
    </QueryClientProvider>
  );
}
