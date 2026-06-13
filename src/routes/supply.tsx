import { createFileRoute } from "@tanstack/react-router";

import { createClientOnlyRoute, RouteErrorBoundary } from "../components/ClientRoute";

export const Route = createFileRoute("/supply")({
  ssr: false,
  component: createClientOnlyRoute(() => import("./supply.client")),
  errorComponent: RouteErrorBoundary,
});
