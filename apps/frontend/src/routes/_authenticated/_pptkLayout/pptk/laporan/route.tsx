import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/laporan",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
