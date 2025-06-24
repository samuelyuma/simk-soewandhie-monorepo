import type { Kegiatan, Rekening, SubKegiatan } from "./anggaran";

export type LpjPdfRequest = {
  periode: string;
  jenisLaporan: string;
  npd: number;
};

export type LpjPdfResponse = {
  id: number;
  is_panjar: boolean;
  list_rekening: Array<
    Pick<Rekening, "id" | "nama" | "kode"> & {
      sub_kegiatan: Pick<SubKegiatan, "id" | "kode" | "nama"> & {
        kegiatan: Pick<Kegiatan, "id" | "kode" | "nama">;
      };
      total_anggaran: number;
      total_belanja: number;
      total_akumulasi_belanja: number;
    }
  >;
  created_at: string;
};
