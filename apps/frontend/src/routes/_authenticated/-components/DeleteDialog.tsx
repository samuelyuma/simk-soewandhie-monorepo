import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteDialogProps = {
  deleteFunction: () => void;
  trigger: React.ReactNode;
};

export default function DeleteDialog({
  deleteFunction,
  trigger,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader className="flex items-center justify-center">
          <CircleAlert size={100} className="text-red-600" />
        </DialogHeader>

        <div className="text-center">
          <p className="font-bold text-2xl">Yakin ingin menghapus item ini?</p>
          <p className="text-lg">Tindakan ini tidak dapat dibatalkan.</p>
        </div>

        <div className="flex justify-end gap-4 ">
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Batal
          </Button>

          <Button
            variant={"destructive"}
            onClick={() => {
              deleteFunction();
              setOpen(false);
            }}
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
