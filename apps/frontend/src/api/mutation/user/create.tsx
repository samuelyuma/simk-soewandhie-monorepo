import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import { useToast } from "@/hooks/useToast";
import api from "@/lib/axios";

import type { ApiError, ApiResponse } from "@/types/api";
import type { CreateUser } from "@/types/user";

function useCreateUserMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    CreateUser
  >({
    mutationKey: ["createUser"],
    mutationFn: async (data) => await api.post("/user", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

export { useCreateUserMutation };
