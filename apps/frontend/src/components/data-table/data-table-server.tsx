import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  type Dispatch,
  Fragment,
  type ReactNode,
  type SetStateAction,
} from "react";

import { cn } from "@/lib/utils";

import type { Meta } from "@/types/api";
import type { FilterItems, SelectItems } from "@/types/helper";

import { Table } from "../ui/table";
import DataTableAddItem, {
  type DataTableCreateItemProps,
} from "./data-table-add-item";
import DataTableBody, { type RowColorFunction } from "./data-table-body";
import DataTableExport, { type TExportData } from "./data-table-export";
import DataTableFilter from "./data-table-filter";
import DataTableFooter, { type FooterData } from "./data-table-footer";
import DataTableHeader from "./data-table-header";
import DataTablePagination from "./data-table-pagination";
import DataTableRowCount from "./data-table-row-count";
import DataTableSearch from "./data-table-search";
import type { DataTableClassNames } from "./data-table-static";

type CustomElementEntry = {
  id: string;
  element: () => ReactNode | null | undefined;
  visible?: boolean;
};

type TopContentOptions = {
  withRowCountSelector: boolean;
  withEventFilter: boolean;
  withKegiatanFilter: boolean;
  withSearchBar: boolean;
  withExportDataSelector: boolean;
  withAddButton: boolean;
  withUpdateButton: boolean;
  customElements?: CustomElementEntry[];
};

type BottomContentOptions = {
  withPagination: boolean;
  withFooter: boolean;
};

type DataTableState = {
  filter: FilterItems[];
  globalFilter: string;
  sorting: SortingState;
  pagination: PaginationState;
};

type SetDataTableState = {
  setFilter: Dispatch<SetStateAction<FilterItems[]>>;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
};

type FilterItemsData = {
  [key: string]: SelectItems[];
};

type ExportOptions = {
  type: TExportData;
  id: string;
};

type DataTableServerProps<T> = {
  data: T[];
  meta?: Meta;
  isLoading?: boolean;
  columns: ColumnDef<T>[];
  tableState: DataTableState;
  filterItems?: FilterItemsData;
  createItem?: DataTableCreateItemProps;
  footerData?: FooterData[];
  rowColor?: RowColorFunction<T>;
  setTableState: SetDataTableState;
  exportOptions?: Partial<ExportOptions>;
  classNames?: Partial<DataTableClassNames>;
  topContentOptions?: Partial<TopContentOptions>;
  bottomContentOptions?: Partial<BottomContentOptions>;
};

export default function DataTableServer<T>({
  data,
  meta,
  columns,
  filterItems,
  createItem,
  footerData,
  classNames,
  tableState,
  setTableState,
  rowColor,
  isLoading = false,
  exportOptions,
  topContentOptions,
  bottomContentOptions = {
    withPagination: true,
  },
}: DataTableServerProps<T>) {
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setTableState.setSorting,
    manualSorting: true,

    onGlobalFilterChange: setTableState.setGlobalFilter,
    manualFiltering: true,

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setTableState.setPagination,
    pageCount: meta?.total_pages ?? 1,
    manualPagination: true,

    state: {
      ...tableState,
    },
  });

  return (
    <div className={cn("flex flex-col gap-4", classNames?.wrapper)}>
      <div className="flex items-center justify-between gap-6">
        {topContentOptions?.withRowCountSelector && (
          <DataTableRowCount table={table} />
        )}
        {topContentOptions?.withEventFilter && filterItems?.event && (
          <DataTableFilter
            usage="EVENT_ID"
            items={filterItems.event}
            filter={tableState.filter}
            setFilter={setTableState.setFilter}
          />
        )}
        {topContentOptions?.withKegiatanFilter && filterItems?.kegiatan && (
          <DataTableFilter
            usage="KEGIATAN"
            items={filterItems.kegiatan}
            filter={tableState.filter}
            setFilter={setTableState.setFilter}
          />
        )}
        {topContentOptions?.withSearchBar && <DataTableSearch table={table} />}
        {topContentOptions?.withExportDataSelector && exportOptions?.type && (
          <DataTableExport type={exportOptions.type} id={exportOptions.id} />
        )}
        {topContentOptions?.withAddButton && createItem && (
          <DataTableAddItem
            dropdownLabel={createItem.dropdownLabel}
            dialog={createItem.dialog}
          />
        )}
        {topContentOptions?.customElements?.map((item) => (
          <Fragment key={item.id}>
            {item.visible !== false && item.element && item.element()}
          </Fragment>
        ))}
      </div>
      <Table className={cn("w-full", classNames?.table)}>
        <DataTableHeader table={table} classNames={classNames?.header} />
        <DataTableBody
          table={table}
          rowColor={rowColor}
          isLoading={isLoading}
          classNames={classNames?.body}
        />
      </Table>
      {bottomContentOptions?.withFooter && footerData && (
        <DataTableFooter footerData={footerData} />
      )}
      {bottomContentOptions?.withPagination && table.getCanNextPage() && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
