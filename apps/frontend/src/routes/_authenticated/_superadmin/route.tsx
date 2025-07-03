import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Navigation from "@/components/layout/Navigation";

import { SuperAdminNavigationItems } from "@/constant/navigation";

export const Route = createFileRoute("/_authenticated/_superadmin")({
  beforeLoad: async ({ context }) => {
    const user = await context.auth.ensureData();
    if (user?.role === "ADMIN") {
      throw redirect({
        to: "/pptk",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Navigation navItems={SuperAdminNavigationItems} />
      <hr className="mt-4 mb-6 border-1" />
      <Outlet />
    </main>
  );
}
