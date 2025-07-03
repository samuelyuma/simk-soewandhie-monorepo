import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Table } from "@/components/ui/table";

import DataTableBody from "./data-table-body";
import DataTableHeader from "./data-table-header";

export type DataTableSubClassNames = {
  wrapper: string;
  row: string;
  cell: string;
  fullBorder?: boolean;
};

export type DataTableClassNames = {
  wrapper: string;
  table: string;
  header: DataTableSubClassNames;
  body: DataTableSubClassNames;
};

type DataTableStaticProps<T> = {
  data: T[];
  isLoading?: boolean;
  columns: ColumnDef<T>[];
  classNames?: Partial<DataTableClassNames>;
};

export default function DataTableStatic<T>({
  data,
  isLoading = false,
  columns,
  classNames,
}: DataTableStaticProps<T>) {
  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={classNames?.wrapper}>
      <Table className={cn("w-full", classNames?.table)}>
        <DataTableHeader table={table} classNames={classNames?.header} />
        <DataTableBody
          table={table}
          isLoading={isLoading}
          classNames={classNames?.body}
        />
      </Table>
    </div>
  );
}
