import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerFormProps = {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  description?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  classNames?: {
    wrapper?: string;
    content?: string;
  };
};

export default function DatePickerForm({
  name,
  label,
  placeholder = "Pilih tanggal",
  value,
  description,
  classNames = {},
  isRequired = false,
  isDisabled = false,
}: DatePickerFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const hasError = Boolean(errors[name]?.message);

  if (value) {
    setValue(name, new Date(value));
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(classNames.wrapper)}>
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
          <div className="flex w-full items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={isDisabled}
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                      hasError && "border-red-500 focus-visible:ring-red-500",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon
                      className={cn(
                        "ml-auto h-4 w-4 opacity-50",
                        hasError && "text-red-500",
                      )}
                    />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="end">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
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
