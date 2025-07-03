import { queryOptions, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

import type { PaginationData, Params } from "@/types/api";
import type { User } from "@/types/user";

export function authQueryOptions() {
  return queryOptions<User>({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
  });
}

export function useAuthQuery() {
  return useQuery(authQueryOptions());
}

export function userListOptions(params?: Params) {
  return queryOptions<PaginationData<User[]>>({
    queryKey: ["userList", params],
    queryFn: async () => {
      const response = await api.get("/user", { params });
      return response.data.data;
    },
  });
}

export function currentUserOptions() {
  return queryOptions<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
  });
}

export function useGetCurrentUser() {
  return useQuery(currentUserOptions());
}
