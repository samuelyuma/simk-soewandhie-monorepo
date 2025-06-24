import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DeleteAlertProps = {
  deleteFunction: () => void;
  trigger: React.ReactNode;
};

export default function DeleteAlert({
  deleteFunction,
  trigger,
}: DeleteAlertProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Yakin ingin hapus item?</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteFunction()}
          className="text-red-600 hover:bg-red-100 focus:bg-red-100"
        >
          Hapus Item
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
