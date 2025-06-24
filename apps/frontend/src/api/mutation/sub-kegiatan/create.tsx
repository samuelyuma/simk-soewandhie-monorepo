import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { kegiatanKeys, subKegiatanKeys } from "@/api/queries/anggaran";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import type { CreateAnggaran } from "@/types/anggaran";
import type { ApiError, ApiResponse } from "@/types/api";

function useCreateSubKegiatanMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateAnggaran
  >({
    mutationKey: ["createSubKegiatan"],
    mutationFn: async (data) => await api.post("/sub-kegiatan", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: kegiatanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subKegiatanKeys.lists() });
      toast({
        variant: "success",
        title: response.data.message,
      });
    },
    onError: (error) => {
      toast({
        variant: "danger",
        title: error.response?.data.message,
      });
      console.error(error);
    },
  });
}

export { useCreateSubKegiatanMutation };
