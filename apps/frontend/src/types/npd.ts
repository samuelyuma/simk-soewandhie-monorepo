import type { Anggaran, Rekening, RincianObjek } from "./anggaran";
import type { User } from "./user";

export interface RincianNpd {
  id: number;
  no: number;
  is_panjar: boolean;
  is_fix: boolean;
  keperluan: string;
  pptk: Pick<User, "id" | "nama">;
  alasan_batal: string | null;
  batal_pada: string | null;
  total_anggaran: number;
  total_pencairan: number;
  created_at?: string;
}

export interface ItemRincianNpd {
  id: number;
  rincian_objek: Pick<
    RincianObjek,
    "id" | "nama" | "nominal_realisasi" | "nominal_anggaran"
  >;
  rekening: Pick<Rekening, "id" | "kode">;
  nominal_pencairan_sebelumnya: number | null;
  pencairan_saat_ini: Pencairan;
}

export interface RincianNpdById extends RincianNpd {
  npd: Npd;
  list_item_rincian_npd: ItemRincianNpd[];
  created_at: string;
}

export interface CreateRincianNpd
  extends Omit<
    RincianNpd,
    | "id"
    | "total_anggaran"
    | "total_pencairan"
    | "pptk"
    | "alasan_batal"
    | "batal_pada"
    | "total_anggaran"
    | "total_pencairan"
  > {
  pptk_id: string;
  npd_id: number;
  list_mapping: Array<{
    rincian_objek_id: number;
  }>;
  list_pencairan: Array<{
    tanggal: string;
    nominal: number;
  }>;
}

export interface UpdateRincianNpd
  extends Omit<
    RincianNpd,
    "id" | "no" | "pptk" | "total_anggaran" | "total_pencairan"
  > {
  pptk_id: string;
  list_pencairan: Array<{
    id: number;
    nominal: number;
  }>;
  list_mapping?: Array<{
    rincian_objek_id: number;
    list_pencairan: Array<{
      tanggal: string;
      nominal: number;
    }>;
  }>;
}

export interface Npd {
  id: number;
  kegiatan: Anggaran;
  sub_kegiatan: Anggaran;
  kpa: Pick<User, "id" | "nama">;
  program: string;
  no_dpa: string;
  tahun: number;
  list_rincian_npd: RincianNpd[];
}

export interface Pencairan {
  id: number;
  nominal: number;
  tanggal: string;
}
