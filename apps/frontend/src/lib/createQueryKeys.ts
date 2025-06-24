import type { Params } from "@/types/api";

export const createQueryKeys = <T extends string>(resource: T) => ({
  all: [resource] as const,
  lists: () => [...createQueryKeys(resource).all, "list"] as const,
  list: (params?: Params) =>
    [...createQueryKeys(resource).lists(), params] as const,
  details: () => [...createQueryKeys(resource).all, "details"] as const,
  detail: (id: string, params?: Params) =>
    [...createQueryKeys(resource).details(), id, params] as const,
});
