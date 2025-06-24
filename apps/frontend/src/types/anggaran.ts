import type { Pencairan } from "./npd";

export interface Events {
  id: number;
  nama: string;
  tgl?: string;
}

export interface CreateEvents extends Omit<Events, "id"> {}
export interface UpdateEvents extends Partial<CreateEvents> {}

export interface Anggaran {
  id: number;
  kode: string;
  nama: string;
}

export interface CreateAnggaran extends Omit<Anggaran, "id"> {}
export interface UpdateAnggaran extends Partial<CreateAnggaran> {}

export interface Kegiatan extends Anggaran {
  total_belanja_kegiatan: number;
  total_nominal_kegiatan: number;
}

export interface KegiatanById extends Kegiatan {
  list_sub_kegiatan: SubKegiatan[];
}

export interface CreateKegiatan extends Omit<Anggaran, "id"> {}

export interface SubKegiatan extends Anggaran {
  total_belanja_sub_kegiatan: number;
  total_nominal_sub_kegiatan: number;
}

export interface SubKegiatanById extends SubKegiatan {
  list_rekening: Rekening[];
}

export interface CreateSubKegiatan extends Anggaran {
  kegiatan_id: number;
}

export interface Rekening extends Anggaran {
  event: Events;
  total_belanja_rekening: number;
  total_nominal_rekening: number;
}

export interface RekeningById extends Rekening {
  list_rincian_objek: RincianObjek[];
}

export interface CreateRekening extends Anggaran {
  sub_kegiatan_id: number;
  event_id: number;
}

export interface RincianObjek {
  id: number;
  nama: string;
  nominal_anggaran: number;
  nominal_realisasi: number;
  pencairan_sebelumnya: Pencairan;
  rekening: Pick<RekeningById, "id" | "kode">;
  is_realized: boolean;
}

export interface CreateRincianObjek extends Omit<RincianObjek, "id"> {
  rekening_id: number;
}

export interface UpdateRincianObjek extends Partial<CreateRincianObjek> {}
