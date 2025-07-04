import { createFileRoute, Outlet } from "@tanstack/react-router";

import Navigation from "@/components/layout/Navigation";
import { PPTKNavigationItems } from "@/constant/navigation";

export const Route = createFileRoute("/_authenticated/_pptkLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Navigation navItems={PPTKNavigationItems} />
      <hr className="mt-4 mb-6 border-1" />
      <Outlet />
    </main>
  );
}
