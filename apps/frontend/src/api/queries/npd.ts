import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import api from "@/lib/axios";
import { createQueryKeys } from "@/lib/createQueryKeys";
import type { PaginationData, Params } from "@/types/api";
import type { Npd, RincianNpdById } from "@/types/npd";

export const rincianNpdKeys = createQueryKeys("rincianNpd");

function rincianNpdListOptions(params?: Params) {
  return queryOptions<PaginationData<Npd>>({
    queryKey: rincianNpdKeys.list(params),
    queryFn: async () => {
      const response = await api.get("/rincian-npd", { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

function rincianNpdDetailOptions(id: string, params?: Params) {
  return queryOptions<PaginationData<RincianNpdById>>({
    queryKey: rincianNpdKeys.detail(id, params),
    queryFn: async () => {
      const response = await api.get(`/rincian-npd/${id}`, { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export { rincianNpdListOptions, rincianNpdDetailOptions };
