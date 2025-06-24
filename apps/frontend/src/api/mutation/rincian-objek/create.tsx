import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { rekeningKeys, rincianObjekKeys } from "@/api/queries/anggaran";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import type { CreateRincianObjek } from "@/types/anggaran";
import type { ApiError, ApiResponse } from "@/types/api";

function useCreateRincianObjekMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateRincianObjek
  >({
    mutationKey: ["createRincianObjek"],
    mutationFn: async (data) => await api.post("/rincian-objek", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rekeningKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rincianObjekKeys.lists() });
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

export { useCreateRincianObjekMutation };
