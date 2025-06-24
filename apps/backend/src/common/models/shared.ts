import { t } from "elysia";

export const pencairanSchema = t.Object({
  id: t.Number(),
  tanggal: t.Date({ error: "Tanggal pencairan harus diisi" }),
  nominal: t.Number(),
});

export const npdSchema = t.Object({
  id: t.Number(),
  program: t.String({
    minLength: 1,
    error: "Nama program harus diisi",
  }),
  no_dpa: t.String({ minLength: 1, error: "Nomor DPA harus diisi" }),
  tahun: t.Number({ minimum: 1, error: "Tahun NPD harus diisi" }),
});

export const rincianNpdSchema = t.Object({
  id: t.Number(),
  no: t.Number({ minimum: 1, error: "Nomor NPD harus diisi" }),
  is_fix: t.Boolean(),
  is_panjar: t.Boolean(),
  keperluan: t.Nullable(t.String()),
  alasan_batal: t.Nullable(t.String()),
  batal_pada: t.Nullable(t.Date()),
});

export type Pencairan = typeof pencairanSchema.static;
