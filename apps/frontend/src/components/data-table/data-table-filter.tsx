import { Bookmark, X } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FilterItems, SelectItems } from "@/types/helper";

import { Button } from "../ui/button";

type DataTableFilterProps = {
  usage: "KEGIATAN" | "EVENT_ID" | "";
  items: SelectItems[];
  filter: FilterItems[];
  setFilter: Dispatch<SetStateAction<FilterItems[]>>;
};

export default function DataTableFilter({
  items,
  usage = "",
  filter,
  setFilter,
}: DataTableFilterProps) {
  const defaultValue = usage === "KEGIATAN" ? "All Sub Kegiatan" : "All";

  const [selectedValue, setSelectedValue] = useState<Partial<FilterItems>>({
    field: usage.toLowerCase(),
    value: defaultValue,
  });

  useEffect(() => {
    const existingFilter = filter.find((f) => f.field === usage.toLowerCase());
    setSelectedValue({
      field: usage.toLowerCase(),
      value: existingFilter ? existingFilter.value : defaultValue,
    });
  }, [filter, usage, defaultValue]);

  const handleValueChange = (value: string) => {
    const newFilter = filter.some((f) => f.field === usage.toLowerCase())
      ? filter.map((f) =>
          f.field === usage.toLowerCase() ? { field: f.field, value } : f,
        )
      : [...filter, { field: usage.toLowerCase(), value }];

    setFilter(newFilter);
    setSelectedValue({ field: usage.toLowerCase(), value });
  };

  const handleResetValue = () => {
    const newFilter = filter.filter((f) => f.field !== usage.toLowerCase());
    setFilter(newFilter);
    setSelectedValue({ field: usage.toLowerCase(), value: defaultValue });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Filter {usage === "EVENT_ID" ? "Event" : "Kegiatan"}</Label>
      <div className="flex items-center">
        <Select
          value={selectedValue.value || defaultValue}
          onValueChange={handleValueChange}
          disabled={items.length === 0}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectedValue.value || defaultValue} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                Filter {usage === "EVENT_ID" ? "Event" : "Kegiatan"}
              </SelectLabel>
              <SelectSeparator />
              {items.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.kode ? (
                    <div className="flex items-center gap-2">
                      <Bookmark />
                      <span>
                        ID: {item.id} / {item.kode} - {item.nama}
                      </span>
                    </div>
                  ) : (
                    item.nama
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedValue.value !== defaultValue && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleResetValue}
            className="ml-2"
          >
            <X className="h-4 w-4 text-zinc-950" />
          </Button>
        )}
      </div>
    </div>
  );
}
