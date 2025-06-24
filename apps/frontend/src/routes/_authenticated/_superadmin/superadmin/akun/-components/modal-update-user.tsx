import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as v from "valibot";

import { useUpdateUserMutation } from "@/api/mutation/user/update";
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
import type { Jabatan, UpdateUser, User } from "@/types/user";

interface FormData
  extends Omit<
    UpdateUser,
    "list_jabatan" | "new_jabatan_list" | "remove_jabatan_list"
  > {
  confirm_password: string;
  jabatan: Array<{
    id?: number;
    jabatan_id: number;
    nama: string;
    originalId: number;
    isNew?: boolean;
  }>;
}

const UpdateUserSchema = v.pipe(
  v.object({
    password: v.pipe(v.string()),
    confirm_password: v.pipe(v.string()),
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

type ModalUserProps = {
  userData?: User;
};

export default function ModalUpdateUser({ userData }: ModalUserProps) {
  const { isOpen, close } = useDialogAndModal();
  const modalName = `modal-update-user`;

  const methods = useForm<FormData>({
    mode: "onBlur",
    resolver: valibotResolver(UpdateUserSchema),
  });
  const { control, handleSubmit, reset } = methods;

  const updateUser = useUpdateUserMutation();
  const isPending = updateUser.isPending;

  const jabatanData = useQuery(jabatanListOptionsInfinite());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jabatan",
  });

  const originalJabatan = useMemo(() => {
    return userData?.list_jabatan || [];
  }, [userData]);

  const jabatanOptions =
    jabatanData.data?.data.map((jabatan: any) => ({
      id: parseInt(jabatan.id),
      nama: jabatan.nama,
    })) || [];

  const handleSelectJabatan = (item: any) => {
    const jabatanItem = item as Jabatan;

    const exists = fields.some((field) => field.jabatan_id === jabatanItem.id);

    if (!exists) {
      append({
        jabatan_id: jabatanItem.id,
        nama: jabatanItem.nama,
        originalId: jabatanItem.id,
        isNew: true,
      });
    }
  };

  useEffect(() => {
    if (isOpen[modalName] && userData) {
      const mappedJabatan = userData.list_jabatan.map((jabatan) => ({
        id: jabatan.id,
        jabatan_id: jabatan.jabatan.id,
        nama: jabatan.jabatan.nama,
        originalId: jabatan.jabatan.id,
        isNew: false,
      }));

      const formData: FormData = {
        nama: userData.nama || "",
        nip: userData.nip || "",
        username: userData.username || "",
        password: "",
        confirm_password: "",
        is_active: userData.is_active,
        jabatan: mappedJabatan,
      };

      reset(formData);
    }
  }, [isOpen[modalName], userData, reset]);

  const submitHandler = (data: FormData) => {
    if (!userData?.id) {
      console.error("User ID not found");
      return;
    }

    const currentJabatanIds = data.jabatan.map((j) => j.jabatan_id);
    const originalJabatanIds = originalJabatan.map((j) => j.jabatan.id);

    const newJabatan = data.jabatan.filter(
      (j) => j.isNew && !originalJabatanIds.includes(j.jabatan_id),
    );

    const removedJabatan = originalJabatan.filter(
      (j) => !currentJabatanIds.includes(j.jabatan.id),
    );

    const existingJabatan = data.jabatan.filter(
      (j) => !j.isNew && j.id !== undefined,
    );

    const payload: UpdateUser = {
      nama: data.nama,
      nip: data.nip,
      username: data.username,
      password: data.password || undefined,
      is_active: data.is_active,
      list_jabatan: existingJabatan.map((j) => ({
        id: j.id!,
        jabatan_id: j.jabatan_id,
      })),
      new_jabatan_list: newJabatan.map((j) => ({
        jabatan_id: j.jabatan_id,
      })),
      removed_jabatan_list: removedJabatan.map((j) => ({
        id: j.id,
      })),
    };

    if (!payload.password) {
      delete payload.password;
    }

    if (payload.new_jabatan_list?.length === 0) {
      delete payload.new_jabatan_list;
    }
    if (payload.removed_jabatan_list?.length === 0) {
      delete payload.removed_jabatan_list;
    }

    const onSuccess = () => {
      close(modalName);
      reset();
      window.location.reload();
    };

    updateUser.mutate({ id: userData.id, data: payload }, { onSuccess });
  };

  return (
    <Dialog
      open={isOpen[modalName]}
      onOpenChange={(open) => !open && close(modalName)}
    >
      <DialogContent className="max-w-[1250px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
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
            />

            <InputForm name="nip" label="NIP" placeholder="Masukkan NIP" />

            <TitleSeparator title="Kredensial" className="col-span-2" />

            <InputForm
              name="username"
              label="Username"
              placeholder="Masukkan username"
              classNames={{ wrapper: "col-span-2" }}
            />

            <InputForm
              name="password"
              label="Password (kosongkan jika tidak ingin mengubah)"
              type="password"
              placeholder="Masukkan password baru"
            />

            <InputForm
              name="confirm_password"
              label="Konfirmasi Password"
              type="password"
              placeholder="Konfirmasi password"
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
                  {fields.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-500"
                      >
                        Tidak ada jabatan dipilih
                      </TableCell>
                    </TableRow>
                  ) : (
                    fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="w-1">{index + 1}</TableCell>
                        <TableCell>
                          {field.nama}
                          {field.isNew && (
                            <span className="ml-2 font-medium text-green-600 text-xs">
                              (Baru)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => close(modalName)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="blue"
                isLoading={isPending}
                disabled={isPending}
              >
                Update User
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
