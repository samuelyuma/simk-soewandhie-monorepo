import prisma from "@/common/config/prisma";
import type { QueryParams } from "@/common/models/params";
import type { Pencairan } from "@/common/models/shared";
import { ResponseBuilder } from "@/common/utils/builder";
import { ResponseManager } from "@/common/utils/manager";

import type {
  CreateEventProps,
  CreateKegiatanProps,
  CreateRekeningProps,
  CreateRincianObjekProps,
  CreateSubKegiatanProps,
} from "./AnggaranModel";
import { AnggaranQuery } from "./AnggaranQuery";

const baseFields = {
  id: true,
  kode: true,
  nama: true,
};

export const AnggaranController = {
  //#region  //*============================ Events ============================
  addEvent: async (data: CreateEventProps) => {
    try {
      const createdEvent = await prisma.event.create({
        data,
        select: {
          id: true,
          nama: true,
          tgl: true,
          created_at: true,
        },
      });
      return ResponseBuilder.success(
        "Event berhasil ditambahkan",
        createdEvent,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Event gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllEvents: async () => {
    try {
      const events = await prisma.event.findMany({
        where: { deleted_at: null },
        orderBy: { id: "asc" },
        select: {
          id: true,
          nama: true,
        },
      });
      if (!events || events.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar event tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success("Daftar event ditemukan", events);
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar event gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getEventById: async (id: number) => {
    try {
      const events = await prisma.event.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          nama: true,
          tgl: true,
          list_rekening: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
        },
      });
      if (!events) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Event tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success("Event ditemukan", events);
    } catch (error) {
      return ResponseBuilder.failure(
        "Event gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editEvent: async (id: number, data: Partial<CreateEventProps>) => {
    try {
      const selectedEvent = await prisma.event.update({
        where: { id, deleted_at: null },
        data,
        select: {
          id: true,
          nama: true,
          tgl: true,
          updated_at: true,
        },
      });
      if (!selectedEvent) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Event tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Event berhasil diperbarui",
        selectedEvent,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Event gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removeEvent: async (id: number) => {
    try {
      const selectedEvent = await prisma.event.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!selectedEvent) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Event tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success("Event berhasil dihapus", undefined, 204);
    } catch (error) {
      return ResponseBuilder.failure(
        "Event gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Events ============================

  //#region  //*============================ Kegiatan ============================
  addKegiatan: async (data: CreateKegiatanProps) => {
    try {
      const kegiatan = await prisma.kegiatan.create({
        data,
        select: {
          ...baseFields,
          created_at: true,
        },
      });
      return ResponseBuilder.success(
        "Kegiatan berhasil ditambahkan",
        kegiatan,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Kegiatan gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllKegiatan: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["id", "kode", "nama"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kode: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const kegiatan = await prisma.kegiatan.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where,
        select: baseFields,
      });

      if (!kegiatan || kegiatan.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar kegiatan tidak ditemukan",
          404,
        );
      }

      const [totalItems, totalRealized, totalNominal] = await Promise.all([
        prisma.kegiatan.count({ where }),
        prisma.$queryRaw<
          [{ kegiatan_id: number; total_belanja_kegiatan: bigint }]
        >(AnggaranQuery.getAllKegiatan.totalRealized()),
        prisma.$queryRaw<
          [{ kegiatan_id: number; total_nominal_kegiatan: bigint }]
        >(AnggaranQuery.getAllKegiatan.totalAnggaran()),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      const realizedMap = new Map(
        totalRealized.map((item) => [
          item.kegiatan_id,
          Number(item.total_belanja_kegiatan),
        ]),
      );
      const nominalMap = new Map(
        totalNominal.map((item) => [
          item.kegiatan_id,
          Number(item.total_nominal_kegiatan),
        ]),
      );

      const data = kegiatan.map((item) => ({
        ...item,
        total_belanja_kegiatan: realizedMap.get(item.id) || 0,
        total_nominal_kegiatan: nominalMap.get(item.id) || 0,
      }));

      return ResponseBuilder.success("Daftar kegiatan ditemukan", {
        data,
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar kegiatan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getKegiatanById: async (id: number, query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["id", "kode", "nama"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kode: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const kegiatan = await prisma.kegiatan.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          kode: true,
          nama: true,
          list_sub_kegiatan: {
            orderBy: { [validatedSortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
            where,
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
        },
      });

      if (!kegiatan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Kegiatan tidak ditemukan",
          404,
        );
      }

      const [
        totalItems,
        totalRealized,
        totalNominal,
        totalRealizedBySubKegiatan,
        totalNominalBySubKegiatan,
      ] = await Promise.all([
        prisma.$queryRaw<[{ count: bigint }]>(
          AnggaranQuery.getKegiatanById.totalItems(id),
        ),
        prisma.$queryRaw<[{ total_belanja_kegiatan: bigint }]>(
          AnggaranQuery.getKegiatanById.totalRealized(id),
        ),
        prisma.$queryRaw<[{ total_nominal_kegiatan: bigint }]>(
          AnggaranQuery.getKegiatanById.totalAnggaran(id),
        ),
        prisma.$queryRaw<
          [{ sub_kegiatan_id: number; total_belanja_sub_kegiatan: bigint }]
        >(AnggaranQuery.getKegiatanById.totalRealizedBySubKegiatan(id)),
        prisma.$queryRaw<
          [{ sub_kegiatan_id: number; total_nominal_sub_kegiatan: bigint }]
        >(AnggaranQuery.getKegiatanById.totalAnggaranBySubKegiatan(id)),
      ]);

      const realizedMap = new Map(
        totalRealizedBySubKegiatan.map((item) => [
          item.sub_kegiatan_id,
          Number(item.total_belanja_sub_kegiatan),
        ]),
      );
      const nominalMap = new Map(
        totalNominalBySubKegiatan.map((item) => [
          item.sub_kegiatan_id,
          Number(item.total_nominal_sub_kegiatan),
        ]),
      );

      const totalPages = Math.ceil(Number(totalItems[0].count) / limit);

      const data = {
        ...kegiatan,
        total_belanja_kegiatan:
          Number(totalRealized[0]?.total_belanja_kegiatan) || 0,
        total_nominal_kegiatan:
          Number(totalNominal[0]?.total_nominal_kegiatan) || 0,
        list_sub_kegiatan: kegiatan.list_sub_kegiatan.map((subKegiatan) => ({
          total_belanja_sub_kegiatan: realizedMap.get(subKegiatan.id) || 0,
          total_nominal_sub_kegiatan: nominalMap.get(subKegiatan.id) || 0,
          ...subKegiatan,
        })),
      };

      return ResponseBuilder.success("Kegiatan ditemukan", {
        data,
        meta: ResponseManager.createResponseMeta(
          page,
          Number(totalItems[0].count),
          totalPages,
        ),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Kegiatan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editKegiatan: async (id: number, data: Partial<CreateKegiatanProps>) => {
    try {
      const kegiatan = await prisma.kegiatan.update({
        where: { id, deleted_at: null },
        data,
        select: {
          ...baseFields,
          updated_at: true,
        },
      });
      if (!kegiatan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Kegiatan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Kegiatan berhasil diperbarui",
        kegiatan,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Kegiatan gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removeKegiatan: async (id: number) => {
    try {
      const kegiatan = await prisma.kegiatan.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!kegiatan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Kegiatan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Kegiatan berhasil dihapus",
        undefined,
        204,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Kegiatan gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Kegiatan ============================

  //#region  //*============================ Sub Kegiatan ============================
  addSubKegiatan: async (data: CreateSubKegiatanProps) => {
    try {
      const subKegiatan = await prisma.subKegiatan.create({
        data,
        select: {
          ...baseFields,
          created_at: true,
        },
      });
      return ResponseBuilder.success(
        "Sub kegiatan berhasil ditambahkan",
        subKegiatan,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Sub kegiatan gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllSubKegiatan: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["id", "kode", "nama"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kode: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const subKegiatan = await prisma.subKegiatan.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where,
        select: baseFields,
      });

      if (!subKegiatan || subKegiatan.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar sub kegiatan tidak ditemukan",
          404,
        );
      }

      const [totalItems, totalRealized, totalNominal] = await Promise.all([
        prisma.kegiatan.count({ where }),
        prisma.$queryRaw<
          [{ sub_kegiatan_id: number; total_belanja_sub_kegiatan: bigint }]
        >(AnggaranQuery.getAllSubKegiatan.totalRealized()),
        prisma.$queryRaw<
          [{ sub_kegiatan_id: number; total_nominal_sub_kegiatan: bigint }]
        >(AnggaranQuery.getAllSubKegiatan.totalAnggaran()),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      const realizedMap = new Map(
        totalRealized.map((item) => [
          item.sub_kegiatan_id,
          Number(item.total_belanja_sub_kegiatan),
        ]),
      );
      const nominalMap = new Map(
        totalNominal.map((item) => [
          item.sub_kegiatan_id,
          Number(item.total_nominal_sub_kegiatan),
        ]),
      );

      const data = subKegiatan.map((item) => ({
        ...item,
        total_belanja_sub_kegiatan: realizedMap.get(item.id) || 0,
        total_nominal_sub_kegiatan: nominalMap.get(item.id) || 0,
      }));

      return ResponseBuilder.success("Daftar sub kegiatan ditemukan", {
        data,
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar sub kegiatan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getSubKegiatanById: async (id: number, query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        filter_by: filterBy,
        filter_value: filterValue,
        search,
      } = query || {};

      const validSortFields = ["id", "kode", "nama"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kode: { contains: search, mode: "insensitive" as const } },
            {
              list_rincian_objek: {
                some: {
                  nama: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }),
      };

      const subKegiatan = await prisma.subKegiatan.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          kode: true,
          nama: true,
          list_rekening: {
            orderBy: { [validatedSortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
            where,
            select: {
              id: true,
              kode: true,
              nama: true,
              event: {
                select: {
                  id: true,
                  nama: true,
                },
              },
            },
          },
        },
      });

      if (!subKegiatan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Sub kegiatan tidak ditemukan",
          404,
        );
      }

      const [
        totalItems,
        totalRealized,
        totalNominal,
        totalRealizedByRekening,
        totalNominalByRekening,
      ] = await Promise.all([
        prisma.$queryRaw<[{ count: bigint }]>(
          AnggaranQuery.getSubKegiatanById.totalItems(
            id,
            filterBy,
            filterValue,
            search,
          ),
        ),
        prisma.$queryRaw<[{ total_belanja_sub_kegiatan: bigint }]>(
          AnggaranQuery.getSubKegiatanById.totalRealized(
            id,
            filterBy,
            filterValue,
            search,
          ),
        ),
        prisma.$queryRaw<[{ total_nominal_sub_kegiatan: bigint }]>(
          AnggaranQuery.getSubKegiatanById.totalAnggaran(
            id,
            filterBy,
            filterValue,
            search,
          ),
        ),
        prisma.$queryRaw<
          [{ rekening_id: number; total_belanja_rekening: bigint }]
        >(AnggaranQuery.getSubKegiatanById.totalRealizedByRekening(id)),
        prisma.$queryRaw<
          [{ rekening_id: number; total_nominal_rekening: bigint }]
        >(AnggaranQuery.getSubKegiatanById.totalAnggaranByRekening(id)),
      ]);

      const totalPages = Math.ceil(Number(totalItems[0].count) / limit);

      const realizedMap = new Map(
        totalRealizedByRekening.map((item) => [
          item.rekening_id,
          Number(item.total_belanja_rekening),
        ]),
      );
      const nominalMap = new Map(
        totalNominalByRekening.map((item) => [
          item.rekening_id,
          Number(item.total_nominal_rekening),
        ]),
      );

      const data = {
        ...subKegiatan,
        total_belanja_sub_kegiatan:
          Number(totalRealized[0]?.total_belanja_sub_kegiatan) || 0,
        total_nominal_sub_kegiatan:
          Number(totalNominal[0]?.total_nominal_sub_kegiatan) || 0,
        list_rekening: subKegiatan.list_rekening.map((rekening) => ({
          ...rekening,
          total_belanja_rekening: realizedMap.get(rekening.id) || 0,
          total_nominal_rekening: nominalMap.get(rekening.id) || 0,
        })),
      };

      return ResponseBuilder.success("Sub kegiatan ditemukan", {
        data,
        meta: ResponseManager.createResponseMeta(
          page,
          Number(totalItems[0].count),
          totalPages,
        ),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Sub kegiatan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editSubKegiatan: async (
    id: number,
    data: Partial<CreateSubKegiatanProps>,
  ) => {
    try {
      const subKegiatan = await prisma.subKegiatan.update({
        where: { id, deleted_at: null },
        data,
        select: {
          ...baseFields,
          updated_at: true,
        },
      });
      if (!subKegiatan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Sub kegiatan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Sub kegiatan berhasil diperbarui",
        subKegiatan,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Sub kegiatan gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removeSubKegiatan: async (id: number) => {
    try {
      const subKegiatan = await prisma.subKegiatan.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!subKegiatan) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Sub kegiatan tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Sub kegiatan berhasil dihapus",
        undefined,
        204,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Sub kegiatan gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Sub Kegiatan ============================

  //#region  //*============================ Rekening ============================
  addRekening: async (data: CreateRekeningProps) => {
    try {
      const rekening = await prisma.rekening.create({
        data,
        select: {
          ...baseFields,
          created_at: true,
        },
      });
      return ResponseBuilder.success(
        "Rekening berhasil ditambahkan",
        rekening,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rekening gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getALlRekening: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        filter_by: filterBy,
        filter_value: filterValue,
        search,
      } = query || {};

      const validSortFields = ["id", "kode", "nama"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kode: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(filterBy &&
          filterValue && {
            [filterBy]: {
              equals:
                filterBy === "event_id" ? Number(filterValue) : filterValue,
            },
          }),
      };

      const rekening = await prisma.rekening.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where,
        select: baseFields,
      });

      if (!rekening || rekening.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar rekening tidak ditemukan",
          404,
        );
      }

      const [totalItems, totalRealized, totalNominal] = await Promise.all([
        prisma.kegiatan.count({ where }),
        prisma.$queryRaw<
          [{ rekening_id: number; total_belanja_rekening: bigint }]
        >(AnggaranQuery.getAllRekening.totalRealized()),
        prisma.$queryRaw<
          [{ rekening_id: number; total_nominal_rekening: bigint }]
        >(AnggaranQuery.getAllRekening.totalAnggaran()),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      const realizedMap = new Map(
        totalRealized.map((item) => [
          item.rekening_id,
          Number(item.total_belanja_rekening),
        ]),
      );
      const nominalMap = new Map(
        totalNominal.map((item) => [
          item.rekening_id,
          Number(item.total_nominal_rekening),
        ]),
      );

      const data = rekening.map((item) => ({
        ...item,
        total_belanja_rekening: realizedMap.get(item.id) || 0,
        total_nominal_rekening: nominalMap.get(item.id) || 0,
      }));

      return ResponseBuilder.success("Daftar rekening ditemukan", {
        data,
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar rekening gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getRekeningById: async (id: number, query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        filter_by: filterBy,
        filter_value: filterValue,
        search,
      } = query || {};

      const validSortFields = ["id", "kode", "nama"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { kode: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(filterBy &&
          filterValue && {
            [filterBy]: {
              equals:
                filterBy === "event_id" ? Number(filterValue) : filterValue,
            },
          }),
      };

      const rekening = await prisma.rekening.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          kode: true,
          nama: true,
          event: {
            select: {
              id: true,
              nama: true,
            },
          },
          list_rincian_objek: {
            orderBy: { [validatedSortBy]: sortOrder },
            skip: (page - 1) * limit,
            take: limit,
            where,
            select: {
              id: true,
              nama: true,
              nominal_anggaran: true,
              nominal_realisasi: true,
            },
          },
        },
      });

      if (!rekening) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rekening tidak ditemukan",
          404,
        );
      }

      const [totalItems, totalRealized, totalNominal] = await Promise.all([
        prisma.$queryRaw<[{ count: bigint }]>(
          AnggaranQuery.getRekeningById.totalItems(id),
        ),
        prisma.$queryRaw<[{ total_belanja_rekening: bigint }]>(
          AnggaranQuery.getRekeningById.totalRealized(id),
        ),
        prisma.$queryRaw<[{ total_nominal_rekening: bigint }]>(
          AnggaranQuery.getRekeningById.totalAnggaran(id),
        ),
      ]);

      const totalPages = Math.ceil(Number(totalItems[0].count) / limit);

      const data = {
        ...rekening,
        total_belanja_rekening:
          Number(totalRealized[0]?.total_belanja_rekening) || 0,
        total_nominal_rekening:
          Number(totalNominal[0]?.total_nominal_rekening) || 0,
      };

      return ResponseBuilder.success("Rekening ditemukan", {
        data: {
          ...data,
          list_rincian_objek: data.list_rincian_objek.map((item) => ({
            ...item,
            nominal_anggaran: Number(item.nominal_anggaran),
            nominal_realisasi: Number(item.nominal_realisasi),
          })),
        },
        meta: ResponseManager.createResponseMeta(
          page,
          Number(totalItems[0].count),
          totalPages,
        ),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Rekening gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editRekening: async (id: number, data: Partial<CreateRekeningProps>) => {
    try {
      const rekening = await prisma.rekening.update({
        where: { id, deleted_at: null },
        data,
        select: {
          ...baseFields,
          updated_at: true,
        },
      });
      if (!rekening) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rekening tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Rekening berhasil diperbarui",
        rekening,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rekening gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removeRekening: async (id: number) => {
    try {
      const rekening = await prisma.rekening.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!rekening) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rekening tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Rekening berhasil dihapus",
        undefined,
        204,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rekening gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Rekening ============================

  //#region  //*============================ Rincian Objek ============================
  addRincianObjek: async (data: CreateRincianObjekProps) => {
    try {
      const rincianObjek = await prisma.rincianObjek.create({
        data,
        select: {
          id: true,
          nama: true,
          nominal_anggaran: true,
          created_at: true,
        },
      });
      return ResponseBuilder.success(
        "Rincian objek berhasil ditambahkan",
        {
          ...rincianObjek,
          nominal_anggaran: Number(rincianObjek.nominal_anggaran),
        },
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian objek gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllRincianObjek: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["id", "nama", "nominal", "is_realized"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [{ nama: { contains: search, mode: "insensitive" as const } }],
        }),
      };

      const listRincianObjek = await prisma.rincianObjek.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where,
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
      });

      if (!listRincianObjek || listRincianObjek.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar rincian objek tidak ditemukan",
          404,
        );
      }

      const finalRincianObjek = await Promise.all(
        listRincianObjek.map(async (item) => {
          let pencairanSebelumnya: Pencairan | null = null;
          const previousPencairan = await prisma.pencairan.findFirst({
            where: {
              item_rincian_npd: {
                rincian_objek_id: item.id,
              },
              deleted_at: null,
            },
            orderBy: { tanggal: "desc" },
            select: {
              id: true,
              tanggal: true,
              nominal: true,
            },
          });

          if (previousPencairan) {
            pencairanSebelumnya = {
              id: previousPencairan.id,
              tanggal: previousPencairan.tanggal,
              nominal: Number(previousPencairan.nominal),
            };
          }

          return {
            ...item,
            nominal_anggaran: Number(item.nominal_anggaran),
            nominal_realisasi: Number(item.nominal_realisasi),
            pencairan_sebelumnya: pencairanSebelumnya,
          };
        }),
      );

      const totalItems = await prisma.rincianObjek.count({ where });

      const totalPages = Math.ceil(totalItems / limit);

      return ResponseBuilder.success("Daftar rincian objek ditemukan", {
        data: finalRincianObjek,
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar rincian objek gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getRincianObjekById: async (id: number) => {
    try {
      const rincianObjek = await prisma.rincianObjek.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          nama: true,
          nominal_anggaran: true,
          nominal_realisasi: true,
        },
      });
      if (!rincianObjek) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rincian objek tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success("Rincian objek ditemukan", {
        ...rincianObjek,
        nominal_anggaran: Number(rincianObjek.nominal_anggaran),
        nominal_realisasi: Number(rincianObjek.nominal_realisasi),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian objek gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editRincianObjek: async (
    id: number,
    data: Partial<CreateRincianObjekProps>,
  ) => {
    try {
      const rincianObjek = await prisma.rincianObjek.update({
        where: { id, deleted_at: null },
        data,
        select: {
          id: true,
          nama: true,
          nominal_anggaran: true,
          nominal_realisasi: true,
          updated_at: true,
        },
      });
      if (!rincianObjek) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rincian objek tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Rincian objek berhasil diperbarui",
        {
          ...rincianObjek,
          nominal_anggaran: Number(rincianObjek.nominal_anggaran),
          nominal_realisasi: Number(rincianObjek.nominal_realisasi),
        },
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian objek gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  removeRincianObjek: async (id: number) => {
    try {
      const rincianObjek = await prisma.rincianObjek.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      if (!rincianObjek) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Rincian objek tidak ditemukan",
          404,
        );
      }
      return ResponseBuilder.success(
        "Rincian objek berhasil dihapus",
        undefined,
        204,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Rincian objek gagal dihapus",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Rincian Objek ============================
};
