import { router } from "@lib/router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import type { User } from "@/types/user";

import { useLogoutMutation } from "@/api/mutation/logout";
import { authQueryOptions, useAuthQuery } from "@/api/queries/user";

type AuthState =
  | { user: null; status: "PENDING" }
  | { user: null; status: "UNAUTHENTICATED" }
  | { user: User; status: "AUTHENTICATED" };

type AuthUtils = {
  signOut: () => void;
  ensureData: () => Promise<User | null>;
};

type AuthData = AuthState & AuthUtils;

function useAuth(): AuthData {
  const currentUser = useAuthQuery();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    router.invalidate();
  }, []);

  useEffect(() => {
    if (currentUser.isError) {
      queryClient.setQueryData(["auth"], null);
    }
  }, [queryClient, currentUser.isError]);

  const utils: AuthUtils = {
    signOut: async () => {
      await logoutMutation.mutateAsync();
      await router.invalidate();
      await router.navigate({ to: "/login" });
    },
    ensureData: async () => {
      try {
        const data = await queryClient.ensureQueryData(authQueryOptions());
        return data || null;
      } catch {
        return null;
      }
    },
  };

  if (currentUser.isPending) {
    return { ...utils, user: null, status: "PENDING" };
  }

  if (currentUser.isSuccess && currentUser.data) {
    return { ...utils, user: currentUser.data, status: "AUTHENTICATED" };
  }

  return { ...utils, user: null, status: "UNAUTHENTICATED" };
}

export { useAuth };
export type { AuthData };
