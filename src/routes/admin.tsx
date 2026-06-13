import { createFileRoute } from "@tanstack/react-router";

import { createClientOnlyRoute, RouteErrorBoundary } from "../components/ClientRoute";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: createClientOnlyRoute(() => import("../components/route-pages/AdminPage")),
  errorComponent: RouteErrorBoundary,
});