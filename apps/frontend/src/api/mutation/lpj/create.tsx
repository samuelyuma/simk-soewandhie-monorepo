import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

import api from "@/lib/axios";

import type { ApiError, ApiResponse } from "@/types/api";
import type { LpjPdfRequest } from "@/types/lpj";

function useCreateLpjMutation() {
  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    LpjPdfRequest
  >({
    mutationKey: ["createLPJ"],
    mutationFn: async (data) => {
      return await api.post("/lpj", data);
    },
  });
}

export { useCreateLpjMutation };
