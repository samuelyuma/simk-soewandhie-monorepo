import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";

import type { ApiError, ApiResponse } from "@/types/api";
import type { UpdateRincianNpd } from "@/types/npd";

import { rincianNpdKeys } from "@/api/queries/npd";

function useUpdateRincianNpdMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    { id: number; data: UpdateRincianNpd }
  >({
    mutationKey: ["updateRincianNpd"],
    mutationFn: async ({ id, data }) =>
      await api.patch(`/rincian-npd/${id}`, data),
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

export { useUpdateRincianNpdMutation };
