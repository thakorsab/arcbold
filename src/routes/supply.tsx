import { createFileRoute } from "@tanstack/react-router";

import { createClientOnlyRoute, RouteErrorBoundary } from "../components/ClientRoute";

export const Route = createFileRoute("/supply")({
  ssr: false,
  component: createClientOnlyRoute(() => import("../components/route-pages/SupplyPage")),
  errorComponent: RouteErrorBoundary,
});
