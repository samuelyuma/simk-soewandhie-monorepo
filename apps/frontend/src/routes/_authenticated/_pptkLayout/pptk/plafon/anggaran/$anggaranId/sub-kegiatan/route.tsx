import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
