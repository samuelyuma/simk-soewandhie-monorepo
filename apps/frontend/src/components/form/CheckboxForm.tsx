import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type CheckboxFormProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  classNames?: {
    wrapper?: string;
    content?: string;
    label?: string;
  };
  onChange?: (checked: boolean) => void;
};

export default function CheckboxForm({
  name,
  label,
  isRequired = false,
  isDisabled = false,
  classNames = {},
  onChange,
}: CheckboxFormProps) {
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
        <FormItem
          className={cn(
            classNames.wrapper,
            label && "flex w-fit items-center justify-center gap-2",
          )}
        >
          <FormControl>
            <Checkbox
              disabled={isDisabled}
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onChange?.(Boolean(checked));
              }}
              defaultValue={field.value}
              className={cn(
                classNames.content,
                hasError && "border-red-500 focus-visible:ring-red-500",
              )}
            />
          </FormControl>
          {label && (
            <FormLabel
              className={cn(
                isRequired &&
                  'after:ml-0.5 after:text-destructive after:content-["*"]',
                hasError && "text-red-500",
              )}
            >
              {label}
            </FormLabel>
          )}
        </FormItem>
      )}
    />
  );
}
