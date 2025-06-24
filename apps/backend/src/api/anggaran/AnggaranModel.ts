import { t } from "elysia";

import { pencairanSchema } from "@/common/models/shared";

export const eventSchema = t.Object({
  id: t.Number(),
  nama: t.String({ minLength: 1, error: "Nama event harus diisi" }),
  tgl: t.Date({ minLength: 1, error: "Tanggal event harus diisi" }),
});

export const kegiatanSchema = t.Object({
  id: t.Number(),
  kode: t.String({ minLength: 1, error: "Kode kegiatan harus diisi" }),
  nama: t.String({ minLength: 1, error: "Nama kegiatan harus diisi" }),
  total_belanja_kegiatan: t.Number(),
  total_nominal_kegiatan: t.Number(),
});

export const subKegiatanSchema = t.Object({
  id: t.Number(),
  kode: t.String({ minLength: 1, error: "Kode sub kegiatan harus diisi" }),
  nama: t.String({ minLength: 1, error: "Nama sub kegiatan harus diisi" }),
  total_belanja_sub_kegiatan: t.Number(),
  total_nominal_sub_kegiatan: t.Number(),
});

export const rekeningSchema = t.Object({
  id: t.Number(),
  kode: t.String({ minLength: 1, error: "Kode rekening harus diisi" }),
  nama: t.String({ minLength: 1, error: "Nama rekening harus diisi" }),
  total_belanja_rekening: t.Number(),
  total_nominal_rekening: t.Number(),
});

export const rincianObjekSchema = t.Object({
  id: t.Number(),
  nama: t.String({ minLength: 1, error: "Nama rincian objek harus diisi" }),
  nominal_anggaran: t.Number(),
  nominal_realisasi: t.Number(),
});

export const rincianObjekWithPencairan = t.Object({
  ...rincianObjekSchema.properties,
  pencairan_sebelumnya: t.Nullable(pencairanSchema),
  rekening: t.Pick(rekeningSchema, ["id", "kode"]),
});

export const detailEventSchema = t.Object({
  ...eventSchema.properties,
  list_rekening: t.Array(
    t.Omit(rekeningSchema, [
      "total_belanja_rekening",
      "total_nominal_rekening",
    ]),
  ),
});

export const detailKegiatanSchema = t.Object({
  ...kegiatanSchema.properties,
  list_sub_kegiatan: t.Array(subKegiatanSchema),
});

export const detailSubKegiatanSchema = t.Object({
  ...subKegiatanSchema.properties,
  list_rekening: t.Array(
    t.Object({
      ...rekeningSchema.properties,
      event: t.Omit(eventSchema, ["tgl"]),
    }),
  ),
});

export const detailRekeningSchema = t.Object({
  ...rekeningSchema.properties,
  event: t.Omit(eventSchema, ["tgl"]),
  list_rincian_objek: t.Array(rincianObjekSchema),
});

export const detailRincianObjekSchema = t.Object({
  ...rincianObjekSchema.properties,
  rekening: rekeningSchema,
});

export const createEventSchema = t.Omit(eventSchema, ["id"]);

export const createKegiatanSchema = t.Omit(kegiatanSchema, [
  "id",
  "total_belanja_kegiatan",
  "total_nominal_kegiatan",
]);

export const createSubKegiatanSchema = t.Omit(
  t.Object({
    user_id: t.String(),
    kegiatan_id: t.Number(),
    ...subKegiatanSchema.properties,
  }),
  ["id", "total_belanja_sub_kegiatan", "total_nominal_sub_kegiatan"],
);

export const createRekeningSchema = t.Omit(
  t.Object({
    event_id: t.Number(),
    sub_kegiatan_id: t.Number(),
    ...rekeningSchema.properties,
  }),
  ["id", "total_belanja_rekening", "total_nominal_rekening"],
);

export const createRincianObjekSchema = t.Omit(
  t.Object({
    ...rincianObjekSchema.properties,
    rekening_id: t.Number(),
    nominal_realisasi: t.Optional(t.Number()),
  }),
  ["id", "nominal_realisasi"],
);

export type CreateEventProps = typeof createEventSchema.static;

export type CreateKegiatanProps = typeof createKegiatanSchema.static;

export type CreateSubKegiatanProps = typeof createSubKegiatanSchema.static;

export type CreateRekeningProps = typeof createRekeningSchema.static;

export type CreateRincianObjekProps = typeof createRincianObjekSchema.static;

export type Rekening = typeof rekeningSchema.static;

export type RincianObjekWithPencairan = typeof rincianObjekWithPencairan.static;
