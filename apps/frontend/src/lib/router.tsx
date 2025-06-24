import { queryClient } from "@lib/query";
import type { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import type { AuthData } from "@/hooks/useAuth";

import { routeTree } from "routeTree.gen";

type RouterContext = {
  auth: AuthData;
  queryClient: QueryClient;
};

const router = createRouter({
  routeTree,
  context: {
    auth: null as unknown as AuthData,
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };
export type { RouterContext };
