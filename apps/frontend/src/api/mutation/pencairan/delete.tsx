import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";

import type { ApiError, ApiResponse } from "@/types/api";

function useDeletePencairanMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    number
  >({
    mutationKey: ["deletePencairan"],
    mutationFn: async (id: number) => await api.delete(`/pencairan/${id}`),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: ["pencairan"] });
      queryClient.invalidateQueries({
        queryKey: ["pencairan", String(id)],
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

export { useDeletePencairanMutation };
