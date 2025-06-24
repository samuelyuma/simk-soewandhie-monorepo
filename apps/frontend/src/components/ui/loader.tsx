import { LoaderCircle, type LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

export interface IProps extends LucideProps {
  className?: string;
  size?: number | string;
}

export const Loader = ({ className, size, ...props }: IProps) => {
  return (
    <LoaderCircle
      size={size}
      className={cn("animate-spin", className)}
      {...props}
    />
  );
};
