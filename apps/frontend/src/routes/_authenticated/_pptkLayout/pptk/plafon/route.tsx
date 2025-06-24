import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_pptkLayout/pptk/plafon")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
