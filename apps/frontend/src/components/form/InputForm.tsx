import type { JSX, RefAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { PasswordInput } from "@/components/ui//password-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, type InputProps } from "@/components/ui/input";

type InputFormProps = {
  type?: string;
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

export default function InputForm({
  type = "text",
  name,
  label,
  placeholder = "",
  value = "",
  description,
  classNames = {},
  isRequired = false,
  isDisabled = false,
}: InputFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const hasError = Boolean(errors[name]?.message);

  const renderInput = (
    field: JSX.IntrinsicAttributes &
      InputProps &
      RefAttributes<HTMLInputElement>,
  ) => {
    if (type === "password") {
      return (
        <PasswordInput
          placeholder={placeholder}
          disabled={isDisabled}
          className={cn(
            classNames.content,
            hasError && "border-red-500 focus-visible:ring-red-500",
          )}
          value={value}
          {...field}
        />
      );
    }

    return (
      <div className={cn("flex w-full", "gap-4", "items-center")}>
        <div className={cn("flex-grow", isDisabled && "cursor-not-allowed")}>
          <Input
            type={type}
            placeholder={placeholder}
            disabled={isDisabled}
            className={cn(
              classNames.content,
              hasError && "border-red-500 focus-visible:ring-red-500",
            )}
            value={value}
            {...field}
          />
        </div>
      </div>
    );
  };

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
          <FormControl>{renderInput(field)}</FormControl>
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
