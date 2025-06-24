import { cn } from "@/lib/utils";

type TitleSeparatorProps = {
  title: string;
  className?: string;
};

export default function TitleSeparator({
  title,
  className,
}: TitleSeparatorProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <hr className="mr-2 w-full bg-black" />

      <p className="whitespace-nowrap font-medium">{title}</p>

      <hr className="ml-2 w-full bg-black" />
    </div>
  );
}
