import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { kegiatanKeys } from "@/api/queries/anggaran";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import type { CreateKegiatan } from "@/types/anggaran";
import type { ApiError, ApiResponse } from "@/types/api";

function useCreateKegiatanMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateKegiatan
  >({
    mutationKey: ["createKegiatan"],
    mutationFn: async (data) => await api.post("/kegiatan", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: kegiatanKeys.lists() });
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

export { useCreateKegiatanMutation };
