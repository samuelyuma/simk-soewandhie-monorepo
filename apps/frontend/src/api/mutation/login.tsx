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

      await queryClient.invalidateQueries(authQueryOptions());
      await router.invalidate();

      await new Promise((resolve) => setTimeout(resolve, 100));

      toast({ variant: "success", title: response.data.message });

      await router.navigate({
        to: user.token === "SUPERADMIN" ? "/superadmin" : "/pptk",
      });
    },
    onError: (error) => {
      toast({
        variant: "danger",
        title: error.response?.data.message ?? error.message,
      });
    },
  });
}
