import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";

import type { ApiError, ApiReturn } from "@/types/api";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<AxiosResponse<ApiReturn>, AxiosError<ApiError>>({
    mutationKey: ["login"],
    mutationFn: async () => await api.post("/auth/logout"),
    onSuccess: async (response) => {
      await queryClient.setQueryData(["auth"], null);
      toast({ variant: "success", title: response.data.message });
    },
    onError: (error) => {
      toast({
        variant: "danger",
        title: error.response?.data.message ?? error.message,
      });
    },
  });
}
