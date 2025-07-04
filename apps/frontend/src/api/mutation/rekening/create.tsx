import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { rekeningKeys, subKegiatanKeys } from "@/api/queries/anggaran";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import type { CreateRekening } from "@/types/anggaran";
import type { ApiError, ApiResponse } from "@/types/api";

function useCreateRekeningMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateRekening
  >({
    mutationKey: ["createRekening"],
    mutationFn: async (data) => await api.post("/rekening", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: subKegiatanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rekeningKeys.lists() });
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

export { useCreateRekeningMutation };
