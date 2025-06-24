import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { rincianNpdKeys } from "@/api/queries/npd";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import type { ApiError, ApiResponse } from "@/types/api";

function useDeleteNpdMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    number
  >({
    mutationKey: ["deleteRincianNpd"],
    mutationFn: async (id: number) => await api.delete(`/rincian-npd/${id}`),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: rincianNpdKeys.list() });
      queryClient.invalidateQueries({
        queryKey: rincianNpdKeys.detail(String(id)),
      });
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

export { useDeleteNpdMutation };
