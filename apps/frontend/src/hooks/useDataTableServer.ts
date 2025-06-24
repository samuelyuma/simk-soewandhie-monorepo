import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import type { FilterItems } from "@/types/helper";

import { useDebounce } from "./useDebounce";

function useDataTableServer() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState<FilterItems[]>([]);

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const debouncedGlobalFilter = useDebounce(globalFilter);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return useMemo(
    () => ({
      tableState: {
        filter,
        globalFilter: debouncedGlobalFilter,
        pagination,
        sorting,
      },
      setTableState: {
        setFilter,
        setGlobalFilter,
        setPagination,
        setSorting,
      },
    }),
    [filter, debouncedGlobalFilter, pagination, sorting],
  );
}

export { useDataTableServer };
