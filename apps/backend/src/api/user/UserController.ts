import { nanoid } from "nanoid";

import prisma from "@/common/config/prisma";
import type { QueryParams } from "@/common/models/params";
import { ResponseBuilder } from "@/common/utils/builder";
import { ResponseManager } from "@/common/utils/manager";
import type { Role } from "@/generated/prisma";

import type {
  CreateUserProps,
  UpdateUserProps,
  UserJabatan,
} from "./UserModel";

export const UserController = {
  //#region  //*============================ User ============================
  addUser: async (data: CreateUserProps) => {
    try {
      const { list_jabatan: listJabatan, ...userData } = data;

      const user = await prisma.user.create({
        data: {
          ...userData,
          id: nanoid(18),
          password: await Bun.password.hash(data.password, "bcrypt"),
          role: "ADMIN",
        },
        select: {
          id: true,
          nama: true,
          created_at: true,
        },
      });

      if (listJabatan && listJabatan.length > 0) {
        listJabatan.map(
          async ({ jabatan_id }) =>
            await prisma.userJabatan.create({
              data: { user_id: user.id, jabatan_id },
            }),
        );
      }

      return ResponseBuilder.success(
        "Pengguna berhasil ditambahkan",
        user,
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Pengguna gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
  getAllUsers: async (query: QueryParams) => {
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

      const validSortFields = ["id", "nama", "nip"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        role: { not: "SUPERADMIN" as Role },
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { username: { contains: search, mode: "insensitive" as const } },
            { nip: { contains: search, mode: "insensitive" as const } },
            {
              list_mapping_jabatan: {
                some: {
                  jabatan: {
                    nama: { contains: search, mode: "insensitive" as const },
                    keterangan: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            },
          ],
        }),
        ...(filterBy &&
          filterValue && {
            list_mapping_jabatan: {
              some: {
                jabatan_id: Number(filterValue),
              },
            },
          }),
      };

      const users = await prisma.user.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where,
        select: {
          id: true,
          nama: true,
          username: true,
          nip: true,
          is_active: true,
          list_mapping_jabatan: {
            orderBy: { id: "asc" },
            where: { deleted_at: null },
            select: {
              id: true,
              jabatan: {
                select: {
                  id: true,
                  nama: true,
                  keterangan: true,
                },
              },
            },
          },
        },
      });

      if (!users || users.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar pengguna tidak ditemukan",
          404,
        );
      }

      const totalItems = await prisma.user.count({ where });
      const totalPages = Math.ceil(totalItems / limit);

      return ResponseBuilder.success("Daftar pengguna ditemukan", {
        data: users.map(({ list_mapping_jabatan: listJabatan, ...user }) => ({
          ...user,
          ...(listJabatan && listJabatan.length > 0
            ? { list_jabatan: listJabatan }
            : undefined),
        })),
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar pengguna gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  editUser: async (id: string, data: UpdateUserProps) => {
    try {
      const {
        list_jabatan: listJabatan,
        new_jabatan_list: newJabatan,
        removed_jabatan_list: removedJabatan,
        password,
        ...userData
      } = data;

      const jabatan: UserJabatan[] | null = [];

      const user = await prisma.user.update({
        where: { id, deleted_at: null },
        data: {
          ...userData,
          ...(password
            ? { password: await Bun.password.hash(password, "bcrypt") }
            : undefined),
        },
        select: {
          id: true,
          nama: true,
          updated_at: true,
        },
      });

      if (listJabatan && listJabatan.length > 0) {
        listJabatan.map(async ({ id: existingJabatanId, jabatan_id }) => {
          const updatedJabatan = await prisma.userJabatan.update({
            where: { id: existingJabatanId, deleted_at: null },
            data: { jabatan_id },
            select: {
              id: true,
              jabatan_id: true,
            },
          });
          jabatan.push(updatedJabatan);
        });
      }

      if (newJabatan && newJabatan.length > 0) {
        newJabatan.map(async ({ jabatan_id }) => {
          const createdJabatan = await prisma.userJabatan.create({
            data: { user_id: id, jabatan_id },
            select: {
              id: true,
              jabatan_id: true,
            },
          });
          jabatan.push(createdJabatan);
        });
      }

      if (removedJabatan && removedJabatan.length > 0) {
        removedJabatan.map(async ({ id: jabatanId }) => {
          await prisma.userJabatan.update({
            where: { id: jabatanId },
            data: { deleted_at: new Date() },
          });
        });
      }

      if (!user) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Pengguna tidak ditemukan",
          404,
        );
      }

      return ResponseBuilder.success(
        "Pengguna berhasil diperbarui",
        {
          ...user,
          ...(jabatan !== null && jabatan.length > 0
            ? { list_mapping_jabatan: jabatan }
            : undefined),
        },
        201,
      );
    } catch (error) {
      return ResponseBuilder.failure(
        "Pengguna gagal diperbarui",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= User ============================

  //#region  //*============================ Jabatan & Bidang ============================
  getAllJabatan: async (query: QueryParams) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by: sortBy = "id",
        sort_order: sortOrder = "asc",
        search,
      } = query || {};

      const validSortFields = ["id", "nama", "keterangan"];
      const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

      const where = {
        deleted_at: null,
        ...(search && {
          OR: [
            { nama: { contains: search, mode: "insensitive" as const } },
            { keterangan: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const jabatan = await prisma.jabatan.findMany({
        orderBy: { [validatedSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        where,
        select: {
          id: true,
          nama: true,
          keterangan: true,
        },
      });

      if (!jabatan || jabatan.length === 0) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Daftar jabatan tidak ditemukan",
          404,
        );
      }

      const totalItems = await prisma.jabatan.count({ where });
      const totalPages = Math.ceil(totalItems / limit);

      return ResponseBuilder.success("Daftar jabatan ditemukan", {
        data: jabatan,
        meta: ResponseManager.createResponseMeta(page, totalItems, totalPages),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Daftar jabatan gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  //#endregion  //*========================= Jabatan & Bidang ============================
};
