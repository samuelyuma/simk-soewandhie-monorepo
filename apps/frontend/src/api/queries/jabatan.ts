import { queryOptions } from "@tanstack/react-query";

import api from "@/lib/axios";

import type { PaginationData } from "@/types/api";
import type { Jabatan } from "@/types/user";

function jabatanListOptionsInfinite() {
  return queryOptions<PaginationData<Jabatan[]>>({
    queryKey: ["jabatanList"],
    queryFn: async () => {
      const response = await api.get("/jabatan/?limit=1000");
      return response.data.data;
    },
  });
}

export { jabatanListOptionsInfinite };
