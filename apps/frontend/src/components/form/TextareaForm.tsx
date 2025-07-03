"use client";

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
import { Textarea } from "@/components/ui/textarea";

type TextareaFormProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  classNames?: {
    wrapper?: string;
    content?: string;
  };
  maxHeight?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export default function TextareaForm({
  name,
  label,
  placeholder,
  description,
  classNames,
  maxHeight,
  isRequired,
  isDisabled,
}: TextareaFormProps) {
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
        <FormItem className={classNames?.wrapper}>
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
          <FormControl>
            <Textarea
              disabled={isDisabled}
              maxHeight={maxHeight}
              placeholder={placeholder}
              className={cn("resize-none rounded-md p-2", classNames?.content)}
              {...field}
            />
          </FormControl>
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
