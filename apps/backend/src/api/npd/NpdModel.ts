import { t } from "elysia";

import {
  npdSchema,
  pencairanSchema,
  rincianNpdSchema,
} from "@/common/models/shared";

import {
  kegiatanSchema,
  rekeningSchema,
  rincianObjekSchema,
  subKegiatanSchema,
} from "../anggaran/AnggaranModel";
import { userSchema } from "../user/UserModel";

export const listRincianNpd = t.Object({
  ...rincianNpdSchema.properties,
  pptk: t.Pick(userSchema, ["id", "nama"]),
  total_anggaran: t.Number(),
  total_pencairan: t.Number(),
});

export const detailPencairan = t.Object({
  ...pencairanSchema.properties,
  rincian_objek: rincianObjekSchema,
  npd: npdSchema,
});

export const detailNpdSchema = t.Object({
  ...npdSchema.properties,
  kpa: t.Pick(userSchema, ["id", "nama"]),
  kegiatan: t.Omit(kegiatanSchema, [
    "total_belanja_kegiatan",
    "total_nominal_kegiatan",
  ]),
  sub_kegiatan: t.Omit(subKegiatanSchema, [
    "total_belanja_sub_kegiatan",
    "total_nominal_sub_kegiatan",
  ]),
  list_rincian_npd: t.Union([
    t.Array(
      t.Object({
        ...listRincianNpd.properties,
        created_at: t.Date({ default: new Date() }),
      }),
    ),
    t.Array(t.Never()),
  ]),
});

export const detailRincianNpdSchema = t.Object({
  ...rincianNpdSchema.properties,
  pptk: t.Pick(userSchema, ["id", "nama", "nip"]),
  npd: t.Object({
    ...npdSchema.properties,
    kpa: t.Pick(userSchema, ["id", "nama", "nip"]),
    kegiatan: t.Omit(kegiatanSchema, [
      "total_belanja_kegiatan",
      "total_nominal_kegiatan",
    ]),
    sub_kegiatan: t.Omit(subKegiatanSchema, [
      "total_belanja_sub_kegiatan",
      "total_nominal_sub_kegiatan",
    ]),
  }),
  list_item_rincian_npd: t.Array(
    t.Object({
      id: t.Number(),
      rincian_objek: rincianObjekSchema,
      rekening: t.Pick(rekeningSchema, ["id", "kode"]),
      nominal_pencairan_sebelumnya: t.Nullable(t.Number()),
      pencairan_saat_ini: t.Nullable(pencairanSchema),
    }),
  ),
});

export const createPencairanSchema = t.Omit(
  t.Object({
    ...pencairanSchema.properties,
    item_rincian_npd_id: t.Number(),
  }),
  ["id"],
);

export const createRincianNpdSchema = t.Omit(
  t.Object({
    ...rincianNpdSchema.properties,
    pptk_id: t.String(),
    npd_id: t.Number(),
    list_mapping: t.Array(t.Object({ rincian_objek_id: t.Number() })),
    list_pencairan: t.Array(
      t.Omit(createPencairanSchema, ["item_rincian_npd_id"]),
    ),
  }),
  ["id", "alasan_batal", "batal_pada"],
);

export const updateRincianNpdSchema = t.Omit(
  t.Intersect([
    t.Partial(rincianNpdSchema),
    t.Object({
      pptk_id: t.Optional(t.String()),
      list_pencairan: t.Optional(
        t.Array(t.Partial(t.Object({ id: t.Number(), nominal: t.Number() }))),
      ),
      list_mapping: t.Optional(
        t.Array(
          t.Object({
            rincian_objek_id: t.Number(),
            list_pencairan: t.Array(
              t.Omit(createPencairanSchema, ["item_rincian_npd_id"]),
            ),
          }),
        ),
      ),
    }),
  ]),
  ["id", "no"],
);

export type CreatePencairanProps = typeof createPencairanSchema.static;

export type CreateRincianNpdProps = typeof createRincianNpdSchema.static;

export type UpdateRincianNpdProps = typeof updateRincianNpdSchema.static;

export type ListRincianNpd = typeof listRincianNpd.static;
