import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { useDialogAndModal } from "@/hooks/useDialogAndModal";
import { formatPrice } from "@/lib/utils";

import CheckboxForm from "@/components/form/CheckboxForm";
import DatePickerForm from "@/components/form/DatePickerForm";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { RincianObjek } from "@/types/anggaran";
import type { CreateRincianNpd } from "@/types/npd";

import { useCreateRincianNpdMutation } from "@/api/mutation/rincian-npd/create";
import { rincianObjekListOptionsInfinite } from "@/api/queries/anggaran";

interface FormData extends CreateRincianNpd {
  tanggal: string;
  rincian_objek: Array<
    Omit<RincianObjek, "id"> & {
      id: string;
      originalId: number;
      nominal: number;
    }
  >;
}

type ModalAddNpdProps = {
  lastRincianObjekIndex: number | undefined;
};

export default function ModalAddNpd({
  lastRincianObjekIndex,
}: ModalAddNpdProps) {
  const { isOpen, close } = useDialogAndModal();
  const modalName = "modal-add-npd";

  const methods = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      keperluan: "",
      tanggal: "",
      is_panjar: false,
      rincian_objek: [],
    },
  });

  const { control, handleSubmit, reset, watch } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rincian_objek",
  });

  const { data } = useQuery(rincianObjekListOptionsInfinite());
  const { user } = useAuth();

  const createMutation = useCreateRincianNpdMutation();

  const handleSelectRincianObjek = (item: any) => {
    const rincianObjekItem = item as RincianObjek;
    // const exists = fields.some(
    //   (field) => field.originalId === rincianObjekItem.id,
    // );
    // if (!exists) {
    //   append({
    //     ...rincianObjekItem,
    //     id: crypto.randomUUID(),
    //     originalId: rincianObjekItem.id,
    //     nominal: 0,
    //   });
    // }
    append({
      ...rincianObjekItem,
      id: crypto.randomUUID(),
      originalId: rincianObjekItem.id,
      nominal: 0,
    });
  };

  const submitHandler = (data: FormData) => {
    if (!user?.id) {
      console.error("User ID not found");
      return;
    }

    const payload: CreateRincianNpd = {
      no: (lastRincianObjekIndex ?? 0) + 1,
      keperluan: data.keperluan,
      pptk_id: user.id,
      npd_id: 1,
      is_fix: false,
      is_panjar: data.is_panjar,
      list_mapping: data.rincian_objek.map((item) => ({
        rincian_objek_id: item.originalId,
      })),
      list_pencairan: data.rincian_objek.map((item) => ({
        tanggal: data.tanggal,
        nominal: Number(item.nominal),
      })),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        close(modalName);
      },
    });
  };

  const handleClose = () => close(modalName);

  return (
    <Dialog
      open={isOpen[modalName]}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-[1250px]">
        <DialogHeader>
          <DialogTitle>Tambah NPD</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="grid grid-cols-2 gap-6">
              <InputForm
                name="keperluan"
                label="Keperluan"
                placeholder="Masukkan keperluan"
                classNames={{
                  wrapper: "col-span-2",
                }}
              />

              <DatePickerForm
                name="tanggal"
                label="Tanggal NPD"
                placeholder="Pilih tanggal"
              />

              <InputForm
                name="kegiatan"
                label="Kegiatan"
                placeholder="1.02.01.2.10 / Peningkatan Pelayanan BLUD"
                isDisabled
                value="1.02.01.2.10 / Peningkatan Pelayanan BLUD"
              />

              <InputForm
                name="pptk"
                label="PPTK"
                isDisabled
                placeholder={user?.nama}
                value={user?.nama}
              />

              <InputForm
                name="sub_kegiatan"
                label="Sub Kegiatan"
                placeholder="1.02.01.2.10.0001 / Pelayanan dan Pelayanan Penunjang BLUD"
                isDisabled
                value="1.02.01.2.10.0001 / Pelayanan dan Pelayanan Penunjang BLUD"
              />

              <InputForm
                name="program"
                label="Program"
                placeholder="Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota"
                isDisabled
                value="Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota"
              />

              <InputForm
                name="no_dpa"
                label="No DPA"
                placeholder="1 02. 0 00 0 00 70 0000 1 02 01 2 10"
                isDisabled
                value="1 02. 0 00 0 00 70 0000 1 02 01 2 10"
              />

              <CheckboxForm name="is_panjar" label="Jenis NPD (Panjar)" />
            </div>

            <TitleSeparator title="Rincian Objek" className="my-5" />

            <Combobox
              placeholder="Pilih Rincian Objek"
              items={data?.data ?? []}
              onSelectItem={handleSelectRincianObjek}
            />

            <div className="mt-4 overflow-hidden rounded-md border">
              <div className="bg-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Kode Rekening</TableHead>
                      <TableHead>Nama Rincian Objek</TableHead>
                      <TableHead>Anggaran/Sisa</TableHead>
                      <TableHead>Sebelumnya</TableHead>
                      <TableHead>Pengajuan</TableHead>
                      <TableHead>Opsi</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              <div className="max-h-[200px] overflow-y-auto">
                <Table>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = field as RincianObjek & {
                        id: string;
                        originalId: number;
                        nominal: number;
                      };
                      return (
                        <TableRow key={field.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.rekening?.kode}</TableCell>
                          <TableCell className="max-w-[250px] whitespace-break-spaces">
                            {item.nama}
                          </TableCell>
                          <TableCell>
                            {formatPrice(item.nominal_anggaran)}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.pencairan_sebelumnya?.nominal
                              ? formatPrice(item.pencairan_sebelumnya?.nominal)
                              : "-"}
                          </TableCell>
                          <TableCell className="flex flex-col items-center justify-end">
                            <InputForm
                              name={`rincian_objek.${index}.nominal`}
                              placeholder="Masukkan jumlah"
                              type="number"
                              classNames={{ wrapper: "w-32" }}
                            />
                            {watch(`rincian_objek.${index}.nominal`) >
                              item.nominal_anggaran && (
                              <span className="text-red-500">
                                Jumlah pengajuan tidak boleh melebihi anggaran
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
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
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                variant="blue"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Menyimpan..." : "Submit"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
