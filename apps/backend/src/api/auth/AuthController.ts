import prisma from "@/common/config/prisma";
import { ResponseBuilder } from "@/common/utils/builder";

import type { LoginProps } from "./AuthModel";

export const AuthController = {
  loginUser: async (body: LoginProps) => {
    try {
      return await prisma.user.findFirst({
        where: { username: body.username },
        select: {
          id: true,
          password: true,
          is_active: true,
          role: true,
          list_mapping_jabatan: {
            where: { deleted_at: null },
            orderBy: { jabatan_id: "asc" },
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
    } catch (error) {
      return ResponseBuilder.failure(
        "User gagal ditemukan",
        (error as Error).message,
      );
    }
  },
  getCurrentUser: async (id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id, deleted_at: null },
        select: {
          id: true,
          nama: true,
          username: true,
          nip: true,
          role: true,
          list_mapping_jabatan: {
            where: {
              deleted_at: null,
            },
            orderBy: { id: "asc" },
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
      if (!user) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Pengguna tidak ditemukan",
          404,
        );
      }
      const { list_mapping_jabatan: listJabatan, ...userData } = user;
      return ResponseBuilder.success("Berhasil mendapatkan user saat ini", {
        ...userData,
        ...(listJabatan && listJabatan.length > 0
          ? { list_jabatan: listJabatan }
          : undefined),
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "Pengguna gagal ditemukan",
        (error as Error).message,
      );
    }
  },
};
