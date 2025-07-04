import { Prisma } from "@/generated/prisma";

export const AnggaranQuery = {
  allKegiatan: {
    totalRealisasi: () => Prisma.sql`
		SELECT
			k.id as kegiatan_id,
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_kegiatan
		FROM kegiatan k
			LEFT JOIN sub_kegiatan sk ON sk.kegiatan_id = k.id AND sk.deleted_at IS NULL
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE k.deleted_at IS NULL
		GROUP BY k.id
	`,
    totalAnggaran: () => Prisma.sql`
		SELECT
			k.id as kegiatan_id,
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_kegiatan
		FROM kegiatan k
			LEFT JOIN sub_kegiatan sk ON sk.kegiatan_id = k.id AND sk.deleted_at IS NULL
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE k.deleted_at IS NULL
		GROUP BY k.id
	`,
  },
  kegiatanById: {
    totalItems: (id: number) => Prisma.sql`
		SELECT COUNT(DISTINCT sk.id) as count
		FROM kegiatan k
			LEFT JOIN sub_kegiatan sk ON sk.kegiatan_id = k.id AND sk.deleted_at IS NULL
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE k.id = ${id}
			AND k.deleted_at IS NULL
	`,
    totalRealisasi: (id: number) => Prisma.sql`
		SELECT
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_kegiatan
		FROM kegiatan k
			LEFT JOIN sub_kegiatan sk ON sk.kegiatan_id = k.id AND sk.deleted_at IS NULL
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE k.id = ${id}
			AND k.deleted_at IS NULL
	`,
    totalAnggaran: (id: number) => Prisma.sql`
		SELECT
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_kegiatan
		FROM kegiatan k
			LEFT JOIN sub_kegiatan sk ON sk.kegiatan_id = k.id AND sk.deleted_at IS NULL
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE k.id = ${id}
			AND k.deleted_at IS NULL
	`,
    totalRealisasiBySubKegiatan: (kegiatanId: number) => Prisma.sql`
		SELECT
            sk.id as sub_kegiatan_id,
            COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_sub_kegiatan
        FROM sub_kegiatan sk
            LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
            LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
        WHERE sk.deleted_at IS NULL
			AND sk.kegiatan_id = ${kegiatanId}
        GROUP BY sk.id
	`,
    totalAnggaranBySubKegiatan: (kegiatanId: number) => Prisma.sql`
		SELECT
            sk.id as sub_kegiatan_id,
            COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_sub_kegiatan
        FROM sub_kegiatan sk
            LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
            LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
        WHERE sk.deleted_at IS NULL
			AND sk.kegiatan_id = ${kegiatanId}
        GROUP BY sk.id
	`,
  },
  allSubKegiatan: {
    totalRealisasi: () => Prisma.sql`
		SELECT
			sk.id as sub_kegiatan_id,
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_sub_kegiatan
		FROM sub_kegiatan sk
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE sk.deleted_at IS NULL
		GROUP BY sk.id
	`,
    totalAnggaran: () => Prisma.sql`
		SELECT
			sk.id as sub_kegiatan_id,
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_sub_kegiatan
		FROM sub_kegiatan sk
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE sk.deleted_at IS NULL
		GROUP BY sk.id
	`,
  },
  subKegiatanById: {
    totalItems: (
      id: number,
      filterBy?: string,
      filterValue?:
        | string
        | number
        | boolean
        | Date
        | (string | number | boolean | Date)[],
      search?: string,
    ) => Prisma.sql`
		SELECT COUNT(DISTINCT r.id) as count
		FROM sub_kegiatan sk
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE sk.id = ${id}
			AND sk.deleted_at IS NULL
			${search ? Prisma.sql`AND (r.nama ILIKE ${`%${search}%`} OR r.kode ILIKE ${`%${search}%`} OR ro.nama ILIKE ${`%${search}%`})` : Prisma.sql``}
			${
        filterBy && typeof filterValue !== "undefined"
          ? Prisma.sql`AND ${Prisma.raw(`r."${filterBy}"`)} = ${Number(filterValue)}`
          : Prisma.sql``
      }
	`,
    totalRealisasi: (
      id: number,
      filterBy?: string,
      filterValue?:
        | string
        | number
        | boolean
        | Date
        | (string | number | boolean | Date)[],
      search?: string,
    ) => Prisma.sql`
		SELECT
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_sub_kegiatan
		FROM sub_kegiatan sk
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE sk.id = ${id}
			AND sk.deleted_at IS NULL
			${search ? Prisma.sql`AND (r.nama ILIKE ${`%${search}%`} OR r.kode ILIKE ${`%${search}%`} OR ro.nama ILIKE ${`%${search}%`})` : Prisma.sql``}
			${
        filterBy && typeof filterValue !== "undefined"
          ? Prisma.sql`AND ${Prisma.raw(`r."${filterBy}"`)} = ${Number(filterValue)}`
          : Prisma.sql``
      }
	`,
    totalAnggaran: (
      id: number,
      filterBy?: string,
      filterValue?:
        | string
        | number
        | boolean
        | Date
        | (string | number | boolean | Date)[],
      search?: string,
    ) => Prisma.sql`
		SELECT
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_sub_kegiatan
		FROM sub_kegiatan sk
			LEFT JOIN rekening r ON r.sub_kegiatan_id = sk.id AND r.deleted_at IS NULL
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE sk.id = ${id}
			AND sk.deleted_at IS NULL
			${search ? Prisma.sql`AND (r.nama ILIKE ${`%${search}%`} OR r.kode ILIKE ${`%${search}%`} OR ro.nama ILIKE ${`%${search}%`})` : Prisma.sql``}
			${
        filterBy && typeof filterValue !== "undefined"
          ? Prisma.sql`AND ${Prisma.raw(`r."${filterBy}"`)} = ${Number(filterValue)}`
          : Prisma.sql``
      }
	`,
    totalRealisasiByRekening: (subKegiatanId: number) => Prisma.sql`
		SELECT
			r.id as rekening_id,
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_rekening
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.deleted_at IS NULL
			AND r.sub_kegiatan_id = ${subKegiatanId}
		GROUP BY r.id
	`,
    totalAnggaranByRekening: (subKegiatanId: number) => Prisma.sql`
		SELECT
			r.id as rekening_id,
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_rekening
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.deleted_at IS NULL
			AND r.sub_kegiatan_id = ${subKegiatanId}
		GROUP BY r.id
	`,
  },
  allRekening: {
    totalRealisasi: () => Prisma.sql`
		SELECT
			r.id as rekening_id,
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_rekening
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.deleted_at IS NULL
		GROUP BY r.id
	`,
    totalAnggaran: () => Prisma.sql`
		SELECT
			r.id as rekening_id,
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_rekening
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.deleted_at IS NULL
		GROUP BY r.id
	`,
  },
  rekeningById: {
    totalItems: (id: number) => Prisma.sql`
		SELECT COUNT(DISTINCT ro.id) as count
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.id = ${id}
			AND r.deleted_at IS NULL
	`,
    totalRealisasi: (id: number) => Prisma.sql`
		SELECT
			COALESCE(SUM(CAST(ro.nominal_realisasi AS BIGINT)), 0) AS total_belanja_rekening
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.id = ${id}
			AND r.deleted_at IS NULL
	`,
    totalAnggaran: (id: number) => Prisma.sql`
		SELECT
			COALESCE(SUM(CAST(ro.nominal_anggaran AS BIGINT)), 0) AS total_nominal_rekening
		FROM rekening r
			LEFT JOIN rincian_objek ro ON ro.rekening_id = r.id AND ro.deleted_at IS NULL
		WHERE r.id = ${id}
			AND r.deleted_at IS NULL
	`,
  },
  allRincianObjek: {
    totalRealisasi: (ids: number[]) => {
      if (!ids || ids.length === 0) {
        return Prisma.sql`
			SELECT
				CAST(NULL AS INTEGER) AS rincian_objek_id,
				CAST(0 AS BIGINT) AS realisasi
			WHERE 1=0
		`;
      }
      return Prisma.sql`
		SELECT
			ro.id AS rincian_objek_id,
			COALESCE(SUM(CAST(p.nominal AS BIGINT)), 0) AS realisasi
		FROM rincian_objek ro
			LEFT JOIN item_rincian_npd irn ON irn.rincian_objek_id = ro.id AND irn.deleted_at IS NULL
			LEFT JOIN pencairan p ON p.item_rincian_npd_id = irn.id AND p.deleted_at IS NULL
		WHERE ro.id IN (${Prisma.join(ids.map((id) => Prisma.sql`${id}`))})
			AND ro.deleted_at IS NULL
		GROUP BY ro.id
		`;
    },
  },
};
