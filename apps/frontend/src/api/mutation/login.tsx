import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";
import { setToken } from "@/lib/cookies";
import { router } from "@/lib/router";
import type { ApiError, ApiResponse } from "@/types/api";
import type { AuthRequest, AuthResponse } from "@/types/user";

import { authQueryOptions } from "../queries/user";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    AxiosResponse<ApiResponse<AuthResponse>>,
    AxiosError<ApiError>,
    AuthRequest
  >({
    mutationKey: ["login"],
    mutationFn: async (data) => await api.post("/auth/login", data),
    onSuccess: async (response) => {
      const user = response.data.data;
      setToken(user.token);
      queryClient.invalidateQueries(authQueryOptions());
      router.invalidate();
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
