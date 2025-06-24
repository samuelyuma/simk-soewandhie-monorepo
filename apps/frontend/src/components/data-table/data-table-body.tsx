import { flexRender, type Row, type Table } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { DataTableSubClassNames } from "./data-table-static";

export type RowColorFunction<T> = (row: Row<T>) => string | undefined;

type DataTableBodyProps<T> = {
  table: Table<T>;
  isLoading?: boolean;
  classNames?: Partial<DataTableSubClassNames>;
  rowColor?: RowColorFunction<T>;
};

export default function DataTableBody<T>({
  table,
  classNames,
  isLoading = false,
  rowColor,
}: DataTableBodyProps<T>) {
  const rows = table.getCoreRowModel().rows;
  const columnCount = table.getAllColumns().length;

  if (isLoading) {
    return (
      <TableBody className={classNames?.wrapper}>
        <TableRow className={classNames?.row}>
          <TableCell
            colSpan={columnCount}
            className={cn("py-6 text-center", classNames?.cell)}
          >
            Data sedang diproses...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody className={classNames?.wrapper}>
        <TableRow className={classNames?.row}>
          <TableCell
            colSpan={columnCount}
            className={cn("py-6 text-center", classNames?.cell)}
          >
            Data tidak ditemukan.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody className={classNames?.wrapper}>
      {rows.map((row, rowIndex) => (
        <TableRow
          key={rowIndex}
          data-state={row.getIsSelected() && "selected"}
          className={cn(classNames?.row, rowColor?.(row))}
        >
          {row.getVisibleCells().map((cell, cellIndex) => (
            <TableCell
              key={cellIndex}
              className={cn("text-start", classNames?.cell)}
              style={{ width: cell.column.getSize() }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
