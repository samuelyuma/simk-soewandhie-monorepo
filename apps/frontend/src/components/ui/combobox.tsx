import { Check, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { RincianObjek } from "@/types/anggaran";
import type { Jabatan } from "@/types/user";

import { ScrollArea } from "./scroll-area";

export type ComboboxItems = {
  id: number | string;
  nama: string;
};

type ComboboxProps<T extends ComboboxItems> = {
  items: T[];
  label?: string;
  placeholder: string;
  classNames?: {
    trigger?: string;
    content?: string;
  };
  lastElementRef?: () => void;
  onSelectItem?: (item: T) => void;
};

export function Combobox<T extends ComboboxItems>({
  items,
  placeholder,
  classNames,
  lastElementRef,
  onSelectItem,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const getItemName = (
    item: ComboboxItems | RincianObjek | Jabatan,
  ): string => {
    return item.nama;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", classNames?.trigger)}
        >
          {value
            ? getItemName(items.find((item) => getItemName(item) === value)!)
            : placeholder}
          <Search className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", classNames?.content)}>
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <ScrollArea>
              <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {items.map((item, index) => {
                  const itemName = getItemName(item);
                  return (
                    <CommandItem
                      key={item.id}
                      value={itemName}
                      ref={
                        index === items.length - 1 ? lastElementRef : undefined
                      }
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        onSelectItem?.(item);
                      }}
                    >
                      {itemName}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === itemName ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
