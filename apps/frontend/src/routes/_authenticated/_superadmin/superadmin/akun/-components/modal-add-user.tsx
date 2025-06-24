import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import { useCreateUserMutation } from "@/api/mutation/user/create";
import { jabatanListOptionsInfinite } from "@/api/queries/jabatan";
import InputForm from "@/components/form/InputForm";
import TitleSeparator from "@/components/layout/TitleSeparator";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDialogAndModal } from "@/hooks/useDialogAndModal";
import type { Jabatan } from "@/types/user";

interface FormData {
  nama: string;
  nip: string;
  username: string;
  password: string;
  confirm_password: string;
  jabatan: Array<
    Omit<Jabatan, "keterangan"> & {
      listJabatanId?: number;
      originalId: number;
    }
  >;
}

const AddUserSchema = v.pipe(
  v.object({
    password: v.pipe(v.string(), v.minLength(1, "Password harus diisi")),
    confirm_password: v.pipe(
      v.string(),
      v.minLength(1, "Konfirmasi password harus diisi"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirm_password"]],
      (input) => input.password === input.confirm_password,
      "Password tidak cocok",
    ),
    ["confirm_password"],
  ),
);

export default function ModalAddUser() {
  const { isOpen, close } = useDialogAndModal();
  const modalName = `modal-add-user`;

  const methods = useForm<FormData>({
    mode: "onBlur",
    resolver: valibotResolver(AddUserSchema),
  });

  const { control, handleSubmit, reset } = methods;

  const createUser = useCreateUserMutation();

  const isPending = createUser.isPending;

  const jabatanData = useQuery(jabatanListOptionsInfinite());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jabatan",
  });

  const jabatanOptions =
    jabatanData.data?.data.map((jabatan: any) => ({
      id: parseInt(jabatan.id),
      nama: jabatan.nama,
    })) || [];

  const handleSelectJabatan = (item: any) => {
    const jabatanItem = item as Jabatan;

    const exists = fields.some((field) => field.originalId === jabatanItem.id);

    if (!exists) {
      append({
        ...jabatanItem,
        id: item.id,
        nama: jabatanItem.nama,
        originalId: jabatanItem.id,
      });
    }
  };

  const submitHandler = (data: FormData) => {
    const onSuccess = () => {
      close(modalName);
      reset();
    };

    const payload = {
      nama: data.nama,
      nip: data.nip,
      username: data.username,
      password: data.password,
      is_active: true,
      list_jabatan: data.jabatan.map((item) => ({
        jabatan_id: item.originalId,
      })),
    };

    createUser.mutate(payload, { onSuccess });
  };

  return (
    <Dialog
      open={isOpen[modalName]}
      onOpenChange={(open) => !open && close(modalName)}
    >
      <DialogContent className="max-w-[1250px]">
        <DialogHeader>
          <DialogTitle>Tambah User</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="grid grid-cols-2 gap-4"
          >
            <InputForm
              name="nama"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              isRequired
            />

            <InputForm
              name="nip"
              label="NIP"
              placeholder="Masukkan NIP"
              isRequired
            />

            <TitleSeparator title="Kredensial" className="col-span-2" />

            <InputForm
              name="username"
              label="Username"
              placeholder="Masukkan username"
              classNames={{ wrapper: "col-span-2" }}
              isRequired
            />

            <InputForm
              name="password"
              label="Password"
              type="password"
              placeholder="Masukkan password"
              isRequired
            />

            <InputForm
              name="confirm_password"
              label="Konfirmasi Password"
              type="password"
              placeholder="Konfirmasi password"
              isRequired
            />

            <TitleSeparator title="Jabatan" className="col-span-2" />

            <Combobox
              placeholder="Pilih Jabatan"
              classNames={{ trigger: "col-span-2" }}
              items={jabatanOptions}
              onSelectItem={handleSelectJabatan}
            />

            <div className="col-span-2 max-h-[200px] w-full overflow-y-auto">
              <Table>
                <TableBody>
                  {fields.map((field, index) => {
                    return (
                      <TableRow key={field.id}>
                        <TableCell className="w-1">{index + 1}</TableCell>
                        <TableCell>{field.nama}</TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                            type="button"
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => remove(index)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                variant="blue"
                isLoading={isPending}
                disabled={isPending}
              >
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
