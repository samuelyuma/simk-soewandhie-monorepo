import { t } from "elysia";

import {
  kegiatanSchema,
  rekeningSchema,
  subKegiatanSchema,
} from "../anggaran/AnggaranModel";

export const createLpjSchema = t.Object({
  bulan: t.Optional(t.String()),
  rincian_npd_id: t.Optional(t.Number()),
  is_panjar: t.Optional(t.Boolean()),
});

export const rekeningLpjSchema = t.Intersect([
  t.Omit(rekeningSchema, ["total_belanja_rekening", "total_nominal_rekening"]),
  t.Object({
    sub_kegiatan: t.Omit(
      t.Object({
        ...subKegiatanSchema.properties,
        kegiatan: t.Omit(kegiatanSchema, [
          "total_belanja_kegiatan",
          "total_nominal_kegiatan",
        ]),
      }),
      ["total_belanja_sub_kegiatan", "total_nominal_sub_kegiatan"],
    ),
    total_anggaran: t.Number(),
    total_belanja: t.Number(),
    total_akumulasi_belanja: t.Number(),
  }),
]);

export const lpjSchema = t.Object({
  id: t.Number(),
  is_panjar: t.Boolean(),
  list_rekening: t.Array(rekeningLpjSchema),
  created_at: t.Date({ default: new Date() }),
});

export type CreateLpj = typeof createLpjSchema.static;

export type RekeningLpj = typeof rekeningLpjSchema.static;
