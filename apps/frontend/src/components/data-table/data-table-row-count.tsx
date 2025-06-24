import type { Table } from "@tanstack/react-table";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PageSizeOptions = ["10", "25", "50", "75", "100"];

type DataTableRowCountProps<T> = {
  table: Table<T>;
};

export default function DataTableRowCount<T>({
  table,
}: DataTableRowCountProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Baris per Halaman</Label>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent>
          {PageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
