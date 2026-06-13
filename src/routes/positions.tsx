import { createFileRoute } from "@tanstack/react-router";

import { createClientOnlyRoute, RouteErrorBoundary } from "../components/ClientRoute";

export const Route = createFileRoute("/positions")({
  ssr: false,
  component: createClientOnlyRoute(() => import("../components/route-pages/PositionsPage")),
  errorComponent: RouteErrorBoundary,
});