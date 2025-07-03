import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { useDialogAndModal } from "@/hooks/useDialogAndModal";

import CheckboxForm from "@/components/form/CheckboxForm";
import InputForm from "@/components/form/InputForm";
import SelectForm from "@/components/form/SelectForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateEventsMutation } from "@/api/mutation/events/create";
import { useCreateKegiatanMutation } from "@/api/mutation/kegiatan/create";
import { useCreateRekeningMutation } from "@/api/mutation/rekening/create";
import { useCreateRincianObjekMutation } from "@/api/mutation/rincian-objek/create";
import { useCreateSubKegiatanMutation } from "@/api/mutation/sub-kegiatan/create";
import { eventListOptions } from "@/api/queries/anggaran";

type AnggaranType =
  | "kegiatan"
  | "sub-kegiatan"
  | "rekening"
  | "events"
  | "rincian-objek";

type ModalAddAnggaranProps = {
  type: AnggaranType;
  params_id?: string;
};

const mutationHooks = {
  kegiatan: useCreateKegiatanMutation,
  "sub-kegiatan": useCreateSubKegiatanMutation,
  rekening: useCreateRekeningMutation,
  events: useCreateEventsMutation,
  "rincian-objek": useCreateRincianObjekMutation,
} as const;

const typeLabels = {
  kegiatan: "Kegiatan",
  "sub-kegiatan": "Sub Kegiatan",
  rekening: "Rekening",
  events: "Event",
  "rincian-objek": "Rincian Objek",
} as const;

const typesWithKode = new Set<AnggaranType>([
  "kegiatan",
  "sub-kegiatan",
  "rekening",
]);

export default function ModalAddAnggaran({
  type,
  params_id,
}: ModalAddAnggaranProps) {
  const { isOpen, close } = useDialogAndModal();

  const modalName = `modal-add-${type}`;
  const parsedParamsId = params_id ? parseInt(params_id) : 0;

  const eventData = useQuery({
    ...eventListOptions(),
    enabled: type === "rekening",
  });

  const methods = useForm({ mode: "onBlur" });
  const { handleSubmit, reset } = methods;

  const useMutationHook = mutationHooks[type];
  const { mutate, isPending } = useMutationHook();

  const eventOptions =
    eventData.data?.map((event) => ({
      id: event.id.toString(),
      name: event.nama || "",
    })) || [];

  const submitHandler = (data: any) => {
    const onSuccess = () => {
      close(modalName);
      reset();
    };

    const payloadMap = {
      kegiatan: data,
      "sub-kegiatan": { ...data, kegiatan_id: parsedParamsId },
      rekening: {
        ...data,
        sub_kegiatan_id: parsedParamsId,
        event_id: data.event_id ? parseInt(data.event_id) : undefined,
      },
      events: { ...data, tgl: new Date() },
      "rincian-objek": {
        ...data,
        nominal_anggaran: parseInt(data.nominal_anggaran),
        rekening_id: parsedParamsId,
      },
    };

    mutate(payloadMap[type], { onSuccess });
  };

  const handleClose = () => close(modalName);

  return (
    <Dialog
      open={isOpen[modalName]}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent className="max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Tambah Data {typeLabels[type]}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="grid grid-cols-1 gap-4"
          >
            <InputForm name="nama" label="Nama" placeholder="Masukkan nama" />
            {typesWithKode.has(type) && (
              <InputForm name="kode" label="Kode" placeholder="Masukkan kode" />
            )}
            {type === "rekening" && (
              <SelectForm
                name="event_id"
                label="Event"
                placeholder="Pilih Event"
                items={eventOptions}
              />
            )}
            {type === "rincian-objek" && (
              <>
                <InputForm
                  name="nominal_anggaran"
                  label="Nominal Anggaran"
                  placeholder="Masukkan nominal"
                  type="number"
                />
                <CheckboxForm name="is_realized" label="Sudah direalisasikan" />
              </>
            )}
            <div className="flex gap-4 justify-self-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
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
