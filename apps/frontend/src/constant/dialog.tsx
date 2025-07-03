import ModalAddAnggaran from "@/routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/-components/modal-add-anggaran";

export const AnggaranDialog = {
  kegiatan: [
    {
      title: "Kegiatan",
      name: "modal-add-kegiatan",
      component: <ModalAddAnggaran type="kegiatan" />,
    },
  ],
  "sub-kegiatan": [
    {
      title: "Sub Kegiatan",
      name: "modal-add-sub-kegiatan",
      component: <ModalAddAnggaran type="sub-kegiatan" />,
    },
  ],
  rekening: [
    {
      title: "Rekening",
      name: "modal-add-rekening",
      component: <ModalAddAnggaran type="rekening" params_id="1" />,
    },
    {
      title: "Event",
      name: "modal-add-events",
      component: <ModalAddAnggaran type="events" />,
    },
  ],
  "rincian-objek": (paramsId: string) => [
    {
      title: "Rincian Objek",
      name: "modal-add-rincian-objek",
      component: <ModalAddAnggaran type="rincian-objek" params_id={paramsId} />,
    },
  ],
};
