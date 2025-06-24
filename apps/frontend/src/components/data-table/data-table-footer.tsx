import { cn } from "@/lib/utils";

import { TableCell, TableFooter, TableRow } from "../ui/table";

export type FooterData = {
  value: string | number;
  colspan?: number;
};

type DataTableFooterProps = {
  footerData: FooterData[];
  classNames?: {
    wrapper?: string;
    row?: string;
    cell?: string;
  };
};

export default function DataTableFooter({
  footerData,
  classNames,
}: DataTableFooterProps) {
  return (
    // <div className={cn(classNames?.wrapper)}>
    //   {footerData.map((item, index) => (
    //     <div
    //       key={index}
    //       className={cn(
    //         "flex items-center justify-between border-zinc-200 border-y bg-zinc-50 py-3 text-sm",
    //         classNames?.row,
    //       )}
    //     >
    //       <p className="font-semibold">{item.label}</p>
    //       <p className="font-medium">{item.value}</p>
    //     </div>
    //   ))}
    // </div>
    <TableFooter className={cn(classNames?.wrapper)}>
      <TableRow className={cn("border-zinc-200", classNames?.row)}>
        {footerData.map((item, index) => (
          <TableCell
            key={index}
            className={cn(classNames?.cell)}
            colSpan={item.colspan}
          >
            {item.value}
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
}
