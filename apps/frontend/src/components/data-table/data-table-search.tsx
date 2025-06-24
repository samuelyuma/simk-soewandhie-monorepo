import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DataTableSearchProps<T> = {
  table: Table<T>;
};

export default function DataTableSearch<T>({ table }: DataTableSearchProps<T>) {
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, table]);

  const resetSearch = () => {
    setSearch("");
    table.setGlobalFilter("");
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label>Cari</Label>
      <div className="flex">
        <Input
          type="text"
          placeholder="Cari Data"
          className="w-full"
          value={search}
          onChange={(e) => setSearch(String(e.target.value))}
        />
        {search && (
          <Button
            variant="outline"
            size="icon"
            onClick={resetSearch}
            className="ml-2"
          >
            <X className="h-4 w-4 text-black" />
          </Button>
        )}
      </div>
    </div>
  );
}
