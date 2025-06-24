import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Header from "@/components/layout/Header";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    let shouldRedirect = false;

    if (context.auth.status === "PENDING") {
      try {
        await context.auth.ensureData();
      } catch (_) {
        shouldRedirect = true;
      }
    }

    if (context.auth.status === "UNAUTHENTICATED") {
      shouldRedirect = true;
    }

    if (shouldRedirect) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="h-screen space-y-4 bg-slate-200 p-4">
      <Header />
      <div className="rounded-2xl bg-white px-6 py-4 shadow">
        <Outlet />
      </div>
    </main>
  );
}
