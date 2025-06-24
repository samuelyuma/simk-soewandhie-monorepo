import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { rincianNpdKeys } from "@/api/queries/npd";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import type { ApiError, ApiResponse } from "@/types/api";
import type { CreateRincianNpd } from "@/types/npd";

function useCreateRincianNpdMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateRincianNpd
  >({
    mutationKey: ["createRincianNpd"],
    mutationFn: async (data) => await api.post("/rincian-npd", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rincianNpdKeys.lists() });
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

export { useCreateRincianNpdMutation };
