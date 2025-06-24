import { Prisma } from "@/generated/prisma";

export const NpdQuery = {
  getAllRincianNpd: {
    anggaranPerRincianIds: (rincianIds: number[]) => {
      if (!rincianIds || rincianIds.length === 0) {
        return Prisma.sql`
        	SELECT
            	CAST(NULL AS INTEGER) AS npd_rincian_id,
            	CAST(0 AS BIGINT) AS total_anggaran
          	WHERE 1=0
        `;
      }
      return Prisma.sql`
        SELECT
          	nr.id AS npd_rincian_id,
          	COALESCE(SUM(ro.nominal_anggaran), CAST(0 AS BIGINT)) AS total_anggaran
        FROM npd_rincian nr
        LEFT JOIN item_rincian_npd irn ON irn.npd_rincian_id = nr.id
          	AND irn.deleted_at IS NULL
        LEFT JOIN rincian_objek ro ON ro.id = irn.rincian_objek_id
          	AND ro.deleted_at IS NULL
        WHERE nr.id IN (${Prisma.join(rincianIds.map((id) => Prisma.sql`${id}`))})
          	AND nr.deleted_at IS NULL
        GROUP BY nr.id
      `;
    },
    pencairanPerRincianIds: (rincianIds: number[]) => {
      if (!rincianIds || rincianIds.length === 0) {
        return Prisma.sql`
          	SELECT
            	CAST(NULL AS INTEGER) AS npd_rincian_id,
            	CAST(0 AS BIGINT) AS total_pencairan
          	WHERE 1=0
        `;
      }
      return Prisma.sql`
        SELECT
          	nr.id AS npd_rincian_id,
          	COALESCE(SUM(p.nominal), CAST(0 AS BIGINT)) AS total_pencairan
        FROM npd_rincian nr
        LEFT JOIN item_rincian_npd irn ON irn.npd_rincian_id = nr.id
          	AND irn.deleted_at IS NULL
        LEFT JOIN pencairan p ON p.item_rincian_npd_id = irn.id
          	AND p.deleted_at IS NULL
        WHERE nr.id IN (${Prisma.join(rincianIds.map((id) => Prisma.sql`${id}`))})
          	AND nr.deleted_at IS NULL
        GROUP BY nr.id
      `;
    },
  },
};
