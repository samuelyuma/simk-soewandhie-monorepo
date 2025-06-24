import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { useUpdateRincianNpdMutation } from "@/api/mutation/rincian-npd/update";
import { rincianObjekListOptionsInfinite } from "@/api/queries/anggaran";
import { userListOptions } from "@/api/queries/user";
import CheckboxForm from "@/components/form/CheckboxForm";
import DatePickerForm from "@/components/form/DatePickerForm";
import InputForm from "@/components/form/InputForm";
import SelectForm from "@/components/form/SelectForm";
import TitleSeparator from "@/components/layout/TitleSeparator";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboboxItems } from "@/components/ui/combobox";
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
import { useDialogAndModal } from "@/hooks/useDialogAndModal";
import { usePriceFormat } from "@/hooks/usePriceFormat";
import type { RincianObjek } from "@/types/anggaran";
import type { RincianNpdById, UpdateRincianNpd } from "@/types/npd";

interface FormData {
  keperluan: string;
  tanggal: string;
  is_panjar: boolean;
  pptk_id: string;
  rincian_objek: Array<
    Omit<RincianObjek, "id" | "pencairan_sebelumnya"> & {
      id: string;
      originalId: number;
      pencairanId: number;
      nominal: number;
      pencairan_sebelumnya: number;
    }
  >;
}

type ModalUpdateNpdProps = {
  dataNpd: RincianNpdById;
};

export default function ModalUpdateNpd({ dataNpd }: ModalUpdateNpdProps) {
  const { isOpen, close } = useDialogAndModal();
  const modalName = "modal-update-npd";

  const userData = useQuery(
    userListOptions({
      filter_by: "jabatan_id",
      filter_value: "3",
    }),
  );

  const methods = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      keperluan: "",
      is_panjar: false,
      rincian_objek: [],
    },
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rincian_objek",
  });

  useEffect(() => {
    if (isOpen[modalName] && dataNpd) {
      const mappedRincianObjek = dataNpd.list_item_rincian_npd.map((item) => {
        return {
          nama: item.rincian_objek.nama,
          nominal_anggaran: item.rincian_objek.nominal_anggaran,
          nominal_realisasi: item.rincian_objek.nominal_realisasi,
          pencairan_sebelumnya: item.nominal_pencairan_sebelumnya ?? 0,
          rekening: item.rekening,
          is_realized: false,
          id: crypto.randomUUID(),
          originalId: item.rincian_objek.id,
          pencairanId: item.pencairan_saat_ini.id,
          nominal: item.pencairan_saat_ini.nominal,
        };
      });

      const formData: FormData = {
        pptk_id: dataNpd.pptk.id,
        keperluan: dataNpd.keperluan || "",
        tanggal: dataNpd.list_item_rincian_npd[0]?.pencairan_saat_ini.tanggal,
        is_panjar: dataNpd.is_panjar || false,
        rincian_objek: mappedRincianObjek,
      };

      reset(formData);
    }
  }, [isOpen[modalName], dataNpd, reset]);

  const { data } = useQuery(rincianObjekListOptionsInfinite());

  const updateMutation = useUpdateRincianNpdMutation();

  const handleSelectRincianObjek = (item: RincianObjek | ComboboxItems) => {
    const rincianObjekItem = item as RincianObjek;
    // const exists = fields.some(
    //   (field) => field.originalId === rincianObjekItem.id,
    // );
    // if (!exists) {
    //   append({
    //     ...rincianObjekItem,
    //     id: crypto.randomUUID(),
    //     originalId: rincianObjekItem.id,
    //     pencairanId: -1,
    //     nominal: 0,
    //   });
    // }
    const { pencairan_sebelumnya, ...rincianObjekWithoutPencairan } =
      rincianObjekItem;
    append({
      ...rincianObjekWithoutPencairan,
      id: crypto.randomUUID(),
      originalId: rincianObjekItem.id,
      pencairanId: -1,
      nominal: 0,
      pencairan_sebelumnya: 0,
    });
  };

  const submitHandler = (data: FormData) => {
    const existingPencairan = data.rincian_objek
      .filter((item) => item.pencairanId !== -1)
      .map((item) => ({
        id: item.pencairanId,
        nominal: Number(item.nominal),
      }));

    const newMappings = data.rincian_objek
      .filter((item) => item.pencairanId === -1)
      .map((item) => ({
        rincian_objek_id: item.originalId,
        list_pencairan: [
          {
            tanggal: data.tanggal,
            nominal: Number(item.nominal),
          },
        ],
      }));

    const payload: UpdateRincianNpd = {
      keperluan: data.keperluan,
      pptk_id: data.pptk_id,
      is_fix: dataNpd.is_fix,
      is_panjar: data.is_panjar,
      list_pencairan: existingPencairan,
      ...(newMappings.length > 0 && { list_mapping: newMappings }),
      alasan_batal: "",
      batal_pada: null,
    };

    updateMutation.mutate(
      { id: dataNpd.id, data: payload },
      {
        onSuccess: () => {
          reset();
          close(modalName);
          window.location.reload();
        },
      },
    );
  };

  const handleClose = () => close(modalName);

  return (
    <Dialog
      open={isOpen[modalName]}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-[1250px]">
        <DialogHeader>
          <DialogTitle>Update NPD</DialogTitle>
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

              <SelectForm
                name="pptk_id"
                label="PPTK"
                placeholder={dataNpd.pptk.nama}
                items={
                  userData.data?.data.map((user) => ({
                    id: user.id,
                    name: user.nama,
                  })) ?? []
                }
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
                      const item = field;
                      return (
                        <TableRow key={field.id} className="table-row">
                          <TableCell className="w-16">{index + 1}</TableCell>
                          <TableCell className="w-32">
                            {item.rekening?.kode}
                          </TableCell>
                          <TableCell className="w-64 whitespace-break-spaces">
                            {item.nama}
                          </TableCell>
                          <TableCell className="w-32">
                            {usePriceFormat(item.nominal_anggaran)}
                          </TableCell>
                          <TableCell className="w-32">
                            {item.pencairan_sebelumnya
                              ? usePriceFormat(item.pencairan_sebelumnya)
                              : "-"}
                          </TableCell>
                          <TableCell className="w-40">
                            <InputForm
                              name={`rincian_objek.${index}.nominal`}
                              placeholder="Masukkan jumlah"
                              type="number"
                            />
                          </TableCell>
                          <TableCell className="w-20 text-center">
                            {item.pencairanId === -1 && (
                              <Button
                                type="button"
                                variant={"outline"}
                                size={"icon"}
                                onClick={() => remove(index)}
                              >
                                <Trash2 size={16} className="text-red-600" />
                              </Button>
                            )}
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
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Menyimpan..." : "Submit"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
