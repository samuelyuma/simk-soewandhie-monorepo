import ErrorBoundaryPage from "@components/pages/Error";
import type { RouterContext } from "@lib/router";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import LoadingPage from "@/components/pages/Loading";
import NotFoundError from "@/components/pages/NotFoundError";
import { useAuth } from "@/hooks/useAuth";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: ErrorBoundaryPage,
});

function RootComponent() {
  const { status } = useAuth();
  if (status === "PENDING") {
    return <LoadingPage />;
  }

  return (
    <main>
      <Outlet />
    </main>
  );
}
