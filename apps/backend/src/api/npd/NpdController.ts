import prisma from "@/common/config/prisma";
import type { QueryParams } from "@/common/models/params";
import { ResponseBuilder } from "@/common/utils/builder";
import { ResponseManager } from "@/common/utils/manager";

import type {
  CreatePencairanProps,
  CreateRincianNpdProps,
  ListRincianNpd,
  UpdateRincianNpdProps,
} from "./NpdModel";
import { NpdQuery } from "./NpdQuery";

export const NpdController = {
  //#region  //*============================ Rincian NPD ============================
  addRincianNpd: async (data: CreateRincianNpdProps) => {
    try {
      const {
        list_pencairan: listPencairan,
        list_mapping: listMapping,
        ...dataNpd
      } = data;

      const rincianNpd = await prisma.npdRincian.create({
        data: {
          ...dataNpd,
          is_fix: false,
        },
        select: {
          id: true,
          npd_id: true,
          pptk_id: true,
          is_panjar: true,
          no: true,
          created_at: true,
        },
      });

      await Promise.all(
        listMapping.map(async (mappingData) => {
          const mapItem = await prisma.itemRincianNpd.create({
            data: {
              ...mappingData,
              npd_rincian_id: rincianNpd.id,
            },
            select: {
              id: true,
              rincian_objek_id: true,
            },
          });

          await prisma.pencairan.createMany({
            data: listPencairan.map((pencairan) => ({
              ...pencairan,
              item_rincian_npd_id: mapItem.id,
            })),
          });

          const realisasi = await prisma.pencairan.aggregate({
            where: {
              item_rincian_npd: {
                rincian_objek_id: mapItem.rincian_objek_id,
              },
              deleted_at: null,
            },
            _sum: {
              nominal: true,
            },
          });

          await prisma.rincianObjek.update({
            where: { id: mapItem.rincian_objek_id },
            data: {
              nominal_realisasi: realisasi._sum.nominal || 0n,
            },
          });
        }),
      );

      return ResponseBuilder.success(
        "Rincian NPD berhasil ditambahkan",
        rincianNpd,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian NPD gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllRincianNpd: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["no", "is_panjar", "keperluan"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        npd_id: 1,
        deleted_at: null,
        ...(search && {
          OR: [
            { keperluan: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const npd = await prisma.npd.findFirst({
        where: { id: 1, deleted_at: null },
        select: {
          id: true,
          program: true,
          no_dpa: true,
          tahun: true,

          kegiatan: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
          sub_kegiatan: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
          kpa: {
            select: {
              id: true,
              nama: true,
            },
          },
        },
      });

      if (!npd) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "NPD tidak ditemukan",
          404,
        );
      }

      const [listRincianNpd, totalItems] = await Promise.all([
        prisma.npdRincian.findMany({
          orderBy: { [validatedSortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
          where,
          select: {
            id: true,
            no: true,
            is_fix: true,
            is_panjar: true,
            keperluan: true,
            alasan_batal: true,
            batal_pada: true,
            created_at: true,
            pptk: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        }),
        prisma.npdRincian.count({ where }),
      ]);

      let detailRincianNpd: ListRincianNpd[] = [];

      if (listRincianNpd && listRincianNpd.length > 0) {
        const rincianIds = listRincianNpd.map((item) => item.id);

        let anggaranSums: { npd_rincian_id: number; total_anggaran: bigint }[] =
          [];
        let pencairanSums: {
          npd_rincian_id: number;
          total_pencairan: bigint;
        }[] = [];

        try {
          [anggaranSums, pencairanSums] = await Promise.all([
            prisma.$queryRaw<
              { npd_rincian_id: number; total_anggaran: bigint }[]
            >(NpdQuery.getAllRincianNpd.anggaranPerRincianIds(rincianIds)),
            prisma.$queryRaw<
              { npd_rincian_id: number; total_pencairan: bigint }[]
            >(NpdQuery.getAllRincianNpd.pencairanPerRincianIds(rincianIds)),
          ]);

          const anggaranMap = new Map(
            anggaranSums.map((item) => [
              item.npd_rincian_id,
              Number(item.total_anggaran),
            ]),
          );

          const pencairanMap = new Map(
            pencairanSums.map((item) => [
              item.npd_rincian_id,
              Number(item.total_pencairan),
            ]),
          );

          detailRincianNpd = listRincianNpd.map((item) => ({
            ...item,
            total_anggaran: anggaranMap.get(item.id) || 0,
            total_pencairan: pencairanMap.get(item.id) || 0,
          }));
        } catch (rawQueryError) {
          console.error(rawQueryError);
          anggaranSums = [];
          pencairanSums = [];
        }
      }

      const totalPages = Math.ceil(totalItems / limit);

      return ResponseBuilder.success("Daftar rincian NPD ditemukan", {
        data: {
          ...npd,
          list_rincian_npd: detailRincianNpd,
        },
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar rincian NPD gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getRincianNpdById: async (id: number, query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["id", "nominal"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        list_pencairan: {
          every: {
            deleted_at: null,
          },
        },
        ...(search && {
          OR: [
            {
              rincian_objek: {
                nama: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              rincian_objek: {
                rekening: {
                  kode: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }),
      };

      const rincianNpd = await prisma.npdRincian.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          no: true,
          is_fix: true,
          is_panjar: true,
          keperluan: true,
          alasan_batal: true,
          batal_pada: true,
          created_at: true,
          pptk: {
            select: {
              id: true,
              nama: true,
              nip: true,
            },
          },
          npd: {
            select: {
              id: true,
              program: true,
              no_dpa: true,
              tahun: true,
              kegiatan: {
                select: {
                  id: true,
                  kode: true,
                  nama: true,
                },
              },
              sub_kegiatan: {
                select: {
                  id: true,
                  kode: true,
                  nama: true,
                },
              },
              kpa: {
                select: {
                  id: true,
                  nama: true,
                  nip: true,
                },
              },
            },
          },
          list_item_rincian_npd: {
            orderBy:
              validatedSortBy === "nominal"
                ? { rincian_objek: { nominal_anggaran: sortOrder } }
                : { [validatedSortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
            where,
            select: {
              id: true,
              rincian_objek: {
                select: {
                  id: true,
                  nama: true,
                  nominal_anggaran: true,
                  nominal_realisasi: true,
                  rekening: {
                    select: {
                      id: true,
                      kode: true,
                    },
                  },
                },
              },
              list_pencairan: {
                orderBy: { tanggal: "desc" },
                take: 1,
                select: {
                  id: true,
                  tanggal: true,
                  nominal: true,
                },
              },
            },
          },
        },
      });

      if (!rincianNpd) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rincian NPD tidak ditemukan",
          404,
        );
      }

      const totalItems = await prisma.itemRincianNpd.count({
        where: { ...where, npd_rincian_id: id },
      });
      const totalPages = Math.ceil(totalItems / limit);

      const listItemRincianNpd = await Promise.all(
        rincianNpd.list_item_rincian_npd.map(async (item) => {
          const currentPencairan = item.list_pencairan[0] || null;
          const pencairanSaatIni = currentPencairan
            ? {
                id: currentPencairan.id,
                tanggal: currentPencairan.tanggal,
                nominal: Number(currentPencairan.nominal),
              }
            : null;

          const sumPencairanSebelumnya = await prisma.pencairan.aggregate({
            where: {
              deleted_at: null,
              item_rincian_npd: {
                rincian_objek_id: item.rincian_objek.id,
                id: { not: item.id },
              },
              tanggal: { lt: pencairanSaatIni?.tanggal },
            },
            _sum: {
              nominal: true,
            },
          });

          return {
            id: item.id,
            rincian_objek: {
              id: item.rincian_objek.id,
              nama: item.rincian_objek.nama,
              nominal_anggaran: Number(item.rincian_objek.nominal_anggaran),
              nominal_realisasi: Number(item.rincian_objek.nominal_realisasi),
            },
            rekening: {
              id: item.rincian_objek.rekening.id,
              kode: item.rincian_objek.rekening.kode,
            },
            pencairan_saat_ini: pencairanSaatIni,
            nominal_pencairan_sebelumnya: Number(
              sumPencairanSebelumnya._sum.nominal !== null
                ? sumPencairanSebelumnya._sum.nominal
                : 0,
            ),
          };
        }),
      );

      return ResponseBuilder.success("Rincian NPD ditemukan", {
        data: {
          ...rincianNpd,
          list_item_rincian_npd: listItemRincianNpd,
        },
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian NPD gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editRincianNpd: async (id: number, data: UpdateRincianNpdProps) => {
    try {
      const {
        list_pencairan: listPencairan,
        list_mapping: listMapping,
        ...npd
      } = data;

      const rincianNpd = prisma.npdRincian.update({
        where: { id, deleted_at: null },
        data: npd,
        select: {
          id: true,
          no: true,
          is_fix: true,
          is_panjar: true,
          keperluan: true,
          alasan_batal: true,
          batal_pada: true,
          updated_at: true,
        },
      });

      if (listPencairan && listPencairan.length > 0) {
        listPencairan.map(async ({ id, nominal }) => {
          await prisma.pencairan.update({
            where: { id, deleted_at: null },
            data: { nominal },
          });
        });
      }

      if (listMapping && listMapping.length > 0) {
        listMapping.map(async (mapping) => {
          const {
            rincian_objek_id: rincianObjekId,
            list_pencairan: listPencairan,
          } = mapping;

          const mapItem = await prisma.itemRincianNpd.create({
            data: {
              rincian_objek_id: rincianObjekId,
              npd_rincian_id: id,
            },
            select: {
              id: true,
              rincian_objek_id: true,
            },
          });

          await prisma.pencairan.createMany({
            data: listPencairan.map((pencairan) => ({
              ...pencairan,
              item_rincian_npd_id: mapItem.id,
            })),
          });

          const realisasi = await prisma.pencairan.aggregate({
            where: {
              item_rincian_npd: {
                rincian_objek_id: mapItem.rincian_objek_id,
              },
              deleted_at: null,
            },
            _sum: {
              nominal: true,
            },
          });

          await prisma.rincianObjek.update({
            where: { id: mapItem.rincian_objek_id },
            data: {
              nominal_realisasi: realisasi._sum.nominal || 0n,
            },
          });
        });
      }

      if (!rincianNpd) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rincian NPD tidak ditemukan",
          404,
        );
      }

      return ResponseBuilder.success(
        "Rincian NPD berhasil diperbarui",
        rincianNpd,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian NPD gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removeRincianNpd: async (id: number) => {
    try {
      const rincianNpd = await prisma.npdRincian.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!rincianNpd) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rincian NPD tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Rincian NPD berhasil dihapus",
        rincianNpd,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian NPD gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Rincian NPD ============================

  //#region  //*============================ Pencairan ============================
  addPencairan: async (data: CreatePencairanProps) => {
    try {
      const rincianObjek = await prisma.pencairan.create({
        data,
        select: {
          id: true,
          tanggal: true,
          nominal: true,
          created_at: true,
        },
      });
      return ResponseBuilder.success(
        "Pencairan berhasil ditambahkan",
        {
          ...rincianObjek,
          nominal: Number(rincianObjek.nominal),
        },
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Pencairan gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllPencairan: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
      } = query || {};

      const validSortFields = ["id", "nominal"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const pencairan = await prisma.pencairan.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where: { deleted_at: null },
        select: {
          id: true,
          tanggal: true,
          nominal: true,
        },
      });

      if (!pencairan || pencairan.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar pencairan tidak ditemukan",
          404,
        );
      }

      const totalItems = await prisma.pencairan.count({
        where: { deleted_at: null },
      });

      const totalPages = Math.ceil(totalItems / limit);

      return ResponseBuilder.success("Daftar pencairan ditemukan", {
        data: pencairan.map((item) => ({
          ...item,
          nominal: Number(item.nominal),
        })),
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar pencairan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getPencairanById: async (id: number) => {
    try {
      const pencairan = await prisma.pencairan.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          tanggal: true,
          nominal: true,
        },
      });
      if (!pencairan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Pencairan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success("Pencairan ditemukan", {
        ...pencairan,
        nominal: Number(pencairan.nominal),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Pencairan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editPencairan: async (id: number, data: Partial<CreatePencairanProps>) => {
    try {
      const pencairan = await prisma.pencairan.update({
        where: { id, deleted_at: null },
        data,
        select: {
          id: true,
          tanggal: true,
          nominal: true,
          updated_at: true,
        },
      });
      if (!pencairan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Pencairan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Pencairan berhasil diperbarui",
        {
          ...pencairan,
          nominal: Number(pencairan.nominal),
        },
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Pencairan gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removePencairan: async (id: number) => {
    try {
      const pencairan = await prisma.pencairan.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!pencairan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Pencairan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Pencairan berhasil dihapus",
        undefined,
        204,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Pencairan gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Pencairan ============================
};
