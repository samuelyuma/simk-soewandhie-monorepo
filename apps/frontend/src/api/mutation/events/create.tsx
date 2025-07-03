import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";

import type { CreateEvents } from "@/types/anggaran";
import type { ApiError, ApiResponse } from "@/types/api";

function useCreateEventsMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateEvents
  >({
    mutationKey: ["createEvents"],
    mutationFn: async (data) => await api.post("/events", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["list", "events"] });
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

export { useCreateEventsMutation };
