import { getCurrentDate } from "@/lib/utils";

export const ExportData = {
  anggaran: (id: string) => ({
    url: `/kegiatan/${id}/export`,
    fileName: `ANGGARAN_${getCurrentDate()}`,
  }),
  bank: {
    url: "/bank/export",
    fileName: `BANK_${getCurrentDate()}`,
  },
  npwp: {
    url: "/npwp/export",
    fileName: `NPWP_${getCurrentDate()}`,
  },
};
