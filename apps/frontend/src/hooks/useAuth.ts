import { router } from "@lib/router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { authQueryOptions, useAuthQuery } from "@/api/queries/user";
import { removeToken } from "@/lib/cookies";
import type { User } from "@/types/user";

type AuthState =
  | { user: null; status: "PENDING" }
  | { user: null; status: "UNAUTHENTICATED" }
  | { user: User; status: "AUTHENTICATED" };

type AuthUtils = {
  signIn: () => void;
  signOut: () => void;
  ensureData: () => Promise<User | null>;
};

type AuthData = AuthState & AuthUtils;

function useAuth(): AuthData {
  const currentUser = useAuthQuery();
  const queryClient = useQueryClient();

  useEffect(() => {
    router.invalidate();
  }, []);

  useEffect(() => {
    if (currentUser.isError) {
      removeToken();
      queryClient.setQueryData(["auth"], null);
    }
  }, [queryClient, currentUser.isError]);

  const utils: AuthUtils = {
    signIn: () => {
      router.navigate({ to: "/login" });
    },
    signOut: () => {
      removeToken();
      queryClient.setQueryData(["auth"], null);
      router.navigate({ to: "/login" });
      router.invalidate();
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
