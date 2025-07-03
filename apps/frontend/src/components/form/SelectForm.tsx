import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectFormItems = {
  id: string;
  kode?: string;
  name: string;
};

type SelectFormProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  items?: SelectFormItems[];
  isRequired?: boolean;
  isDisabled?: boolean;
  classNames?: {
    wrapper?: string;
    trigger?: string;
    content?: string;
  };
  lastElementRef?: () => void;
};

export default function SelectForm({
  name,
  label,
  placeholder = "Pilih opsi",
  description,
  items,
  classNames = {},
  isRequired = false,
  isDisabled = false,
  lastElementRef,
}: SelectFormProps) {
  const [selectedItem, setSelectedItem] = useState<SelectFormItems | undefined>(
    undefined,
  );
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const hasError = Boolean(errors[name]?.message);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classNames.wrapper}>
          {label && (
            <FormLabel
              className={cn(
                isRequired &&
                  'after:ml-0.5 after:text-destructive after:content-["*"]',
              )}
            >
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isDisabled}
          >
            <FormControl>
              {selectedItem ? (
                <SelectTrigger
                  className={cn(
                    "!h-14 w-full cursor-pointer",
                    classNames.trigger,
                  )}
                >
                  <div className="flex w-full items-center gap-3">
                    <Bookmark className="h-4 w-4 flex-shrink-0" />
                    <div className="grid w-full justify-start text-start">
                      <p className="font-medium">
                        ID: {selectedItem.id} / {selectedItem.kode}
                      </p>
                      <p>{selectedItem.name}</p>
                    </div>
                  </div>
                </SelectTrigger>
              ) : (
                <SelectTrigger
                  className={cn("w-full cursor-pointer", classNames.trigger)}
                >
                  <SelectValue
                    placeholder={placeholder}
                    className={cn(
                      classNames.trigger,
                      hasError && "border-red-500 focus-visible:ring-red-500",
                    )}
                  />
                </SelectTrigger>
              )}
            </FormControl>
            <SelectContent
              ref={lastElementRef}
              className={cn(
                "cursor-pointer",
                classNames.content,
                hasError && "border-red-500 focus-visible:ring-red-500",
              )}
            >
              {items?.map((item) =>
                item.kode ? (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className="h-4 w-4 flex-shrink-0" />
                      <div className="grid w-full">
                        <p className="font-medium">
                          ID: {item.id} / {item.kode}
                        </p>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  </SelectItem>
                ) : (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          {description && (
            <FormDescription className={cn(hasError && "text-red-400")}>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
