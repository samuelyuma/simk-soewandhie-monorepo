import { ChevronDown, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";

import { useDialogAndModal } from "@/hooks/useDialogAndModal";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DialogProps = {
  title: string;
  subItems?: {
    title: string;
    name: string;
    component: ReactNode;
  }[];
  name?: string;
  component?: ReactNode;
};

export type DataTableCreateItemProps = {
  dropdownLabel: string;
  dialog: DialogProps[];
};

export default function DataTableAddItem({
  dropdownLabel,
  dialog,
}: DataTableCreateItemProps) {
  const { open } = useDialogAndModal();

  return (
    <div className="mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"blue"} className="self-end">
            <Plus size={16} />
            <p>Tambah</p>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dialog.map((item, index) => (
            <Fragment key={index}>
              {item.subItems ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex w-full items-center gap-1">
                    <p>{item.title}</p>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {item.subItems.map((subItem, index) => (
                      <DropdownMenuItem
                        key={index}
                        className="cursor-pointer"
                        onClick={() => {
                          if (subItem.name) {
                            open(subItem.name);
                          }
                        }}
                      >
                        <p>{subItem.title}</p>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    if (item.name) {
                      open(item.name);
                    }
                  }}
                >
                  <p>{item.title}</p>
                </DropdownMenuItem>
              )}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog.map((item, index) => (
        <Fragment key={index}>
          {item.component}
          {item.subItems?.map((subItem, subIndex) => (
            <Fragment key={`${index}-${subIndex}`}>
              {subItem.component}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
