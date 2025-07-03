import { flexRender, type Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { DataTableSubClassNames } from "./data-table-static";

type DataTableHeaderProps<T> = {
  table: Table<T>;
  classNames?: Partial<DataTableSubClassNames>;
};

export default function DataTableHeader<T>({
  table,
  classNames,
}: DataTableHeaderProps<T>) {
  return (
    <TableHeader className={cn("bg-zinc-100", classNames?.wrapper)}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className={classNames?.row}>
          {headerGroup.headers.map((header, index) => {
            const isLastColumn = index === headerGroup.headers.length - 1;

            return (
              <TableHead
                key={header.id}
                style={{ width: header.column.getSize() }}
                className={cn(
                  "border-zinc-200",
                  classNames?.wrapper,
                  header.column.columnDef.meta?.className,
                  header.column.getCanSort() && "cursor-pointer select-none",
                )}
                colSpan={header.colSpan}
                onClick={() =>
                  header.column.getCanSort() && !isLastColumn
                    ? header.column.toggleSorting()
                    : undefined
                }
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={cn(
                      "relative flex items-center justify-start gap-2 bg-zinc-100 font-semibold text-sm text-zinc-950",
                      header.column.id === "opsi"
                        ? "justify-center"
                        : undefined,
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <ChevronDown
                        className={cn(
                          "w-3 duration-300",
                          header.column.getIsSorted() === "asc" && "rotate-180",
                        )}
                      />
                    )}
                  </div>
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
