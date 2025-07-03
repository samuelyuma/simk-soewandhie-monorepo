import {
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";

import api from "@/lib/axios";
import { createQueryKeys } from "@/lib/createQueryKeys";

import type {
  Events,
  Kegiatan,
  KegiatanById,
  RekeningById,
  RincianObjek,
  SubKegiatanById,
} from "@/types/anggaran";
import type { PaginationData, Params } from "@/types/api";

export const kegiatanKeys = createQueryKeys("kegiatan");
export const subKegiatanKeys = createQueryKeys("subKegiatan");
export const rekeningKeys = createQueryKeys("rekening");
export const rincianObjekKeys = createQueryKeys("rincian-objek");

function eventListOptions() {
  return queryOptions<Events[]>({
    queryKey: ["list", "events"],
    queryFn: async () => {
      const response = await api.get("/events");
      return response.data.data;
    },
  });
}

function kegiatanListOptions(params?: Params) {
  return queryOptions<PaginationData<Kegiatan[]>>({
    queryKey: kegiatanKeys.list(params),
    queryFn: async () => {
      const response = await api.get("/kegiatan", { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

function subKegiatanListOptions(id: string, params?: Params) {
  return queryOptions<PaginationData<KegiatanById>>({
    queryKey: kegiatanKeys.detail(id, params),
    queryFn: async () => {
      const response = await api.get(`/kegiatan/${id}`, { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

function rekeningListOptions(id: string, params?: Params) {
  return queryOptions<PaginationData<SubKegiatanById>>({
    queryKey: subKegiatanKeys.detail(id, params),
    queryFn: async () => {
      const response = await api.get(`/sub-kegiatan/${id}`, { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

function rincianObjekListOptions(id: string, params?: Params) {
  return queryOptions<PaginationData<RekeningById>>({
    queryKey: rekeningKeys.detail(id, params),
    queryFn: async () => {
      const response = await api.get(`/rekening/${id}`, { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

function rincianObjekListOptionsInfinite() {
  return queryOptions<PaginationData<RincianObjek[]>>({
    queryKey: rincianObjekKeys.list(),
    queryFn: async () => {
      const response = await api.get("/rincian-objek/?page=1&limit=1000");
      return response.data.data;
    },
  });
}

function useGetInfiniteRincianObjekQuery() {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery<PaginationData<RincianObjek[]>>({
      queryKey: ["rincian-objek", "infinite"],
      queryFn: async ({ pageParam }) => {
        const response = await api.get("/rincian-objek", {
          params: { page: pageParam },
        });
        return response.data.data;
      },
      staleTime: Infinity,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.data.length ? allPages.length + 1 : undefined;
      },
      placeholderData: keepPreviousData,
    });

  const observer = useRef<IntersectionObserver>(null);
  const lastRincianObjekRef = useCallback(() => {
    if (isPending) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });
  }, [fetchNextPage, hasNextPage, isFetching, isPending]);

  const infiniteRincianObjekData = useMemo(() => {
    return data?.pages.flatMap((item) => item.data) || [];
  }, [data]);

  return { lastRincianObjekRef, infiniteRincianObjekData };
}

export {
  eventListOptions,
  kegiatanListOptions,
  subKegiatanListOptions,
  rekeningListOptions,
  rincianObjekListOptions,
  rincianObjekListOptionsInfinite,
  useGetInfiniteRincianObjekQuery,
};
