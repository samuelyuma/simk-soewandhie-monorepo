import prisma from "@/common/config/prisma";
import { ResponseBuilder } from "@/common/utils/builder";

import { mergeSameObjectById } from "./LpjHelper";
import type { CreateLpj, RekeningLpj } from "./LpjModel";

export const LpjController = {
  createLpj: async (body: CreateLpj) => {
    try {
      const { bulan, rincian_npd_id: rincianNpdId, is_panjar: isPanjar } = body;

      let rekeningResponse: RekeningLpj[] = [];
      let panjarStatus = false;

      if (bulan && rincianNpdId) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Gunakan salah satu diantara bulan atau ID dari NPD",
          422,
        );
      }

      if (rincianNpdId && (isPanjar === true || isPanjar === false)) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Status panjar tidak dapat digunakan bersama dengan ID dari NPD",
          422,
        );
      }

      if (bulan && (isPanjar === undefined || isPanjar === null)) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Status panjar harus disertakan ketika menggunakan bulan",
          422,
        );
      }

      if (!bulan && !rincianNpdId) {
        return ResponseBuilder.failure(
          "Terjadi kesalahan",
          "Pilih bulan atau masukkan ID dari NPD",
          422,
        );
      }

      if (bulan) {
        const firstDayOfMonth = new Date(
          Date.UTC(new Date().getFullYear(), Number(bulan) - 1, 1),
        );
        const lastDayOfMonth = new Date(
          Date.UTC(new Date().getFullYear(), Number(bulan), 0),
        );

        const pencairan = await prisma.pencairan.findMany({
          where: {
            deleted_at: null,
            tanggal: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
          },
          select: {
            id: true,
            nominal: true,
            item_rincian_npd: {
              select: {
                npd_rincian_id: true,
              },
            },
          },
        });

        const rekeningData: RekeningLpj[] = [];

        for (const p of pencairan) {
          const totalBelanja = Number(p.nominal) ?? 0;
          let totalAnggaran = 0;
          let totalAkumulasiBelanja = 0;

          const rincianNpd = await prisma.npdRincian.findUnique({
            where: { id: p.item_rincian_npd.npd_rincian_id, deleted_at: null },
            select: {
              id: true,
              is_panjar: true,
            },
          });

          if (!rincianNpd) {
            return ResponseBuilder.failure(
              "Terjadi kesalahan",
              "Rincian NPD tidak ditemukan",
              404,
            );
          }

          panjarStatus = rincianNpd.is_panjar;

          const rincianObjek = await prisma.rincianObjek.findMany({
            where: {
              deleted_at: null,
              list_alokasi_item: {
                some: {
                  list_pencairan: {
                    some: {
                      id: p.id,
                    },
                  },
                },
              },
            },
            select: {
              id: true,
              nominal_anggaran: true,
              nominal_realisasi: true,
            },
          });

          for (const ro of rincianObjek) {
            totalAnggaran += Number(ro.nominal_anggaran) ?? 0;
            totalAkumulasiBelanja += Number(ro.nominal_realisasi) ?? 0;

            const rekening = await prisma.rekening.findMany({
              orderBy: { id: "asc" },
              where: {
                deleted_at: null,
                list_rincian_objek: {
                  some: {
                    id: ro.id,
                  },
                },
              },
              select: {
                id: true,
                kode: true,
                nama: true,
                sub_kegiatan: {
                  select: {
                    id: true,
                    kode: true,
                    nama: true,
                    kegiatan: {
                      select: {
                        id: true,
                        kode: true,
                        nama: true,
                      },
                    },
                  },
                },
              },
            });

            for (const r of rekening) {
              if (totalBelanja > 0 && totalAkumulasiBelanja > 0) {
                rekeningData.push({
                  ...r,
                  total_anggaran: Number(totalAnggaran),
                  total_belanja: Number(totalBelanja),
                  total_akumulasi_belanja: Number(totalAkumulasiBelanja),
                });
              }
            }
          }
        }

        rekeningResponse = mergeSameObjectById(rekeningData);
      } else if (rincianNpdId) {
        const rincianNpd = await prisma.npdRincian.findUnique({
          where: { id: rincianNpdId, deleted_at: null },
          select: {
            id: true,
            is_panjar: true,
            list_item_rincian_npd: {
              where: { deleted_at: null },
              select: {
                id: true,
                rincian_objek: {
                  select: {
                    id: true,
                    nominal_anggaran: true,
                    nominal_realisasi: true,
                    rekening: {
                      select: {
                        id: true,
                        kode: true,
                        nama: true,
                        sub_kegiatan: {
                          select: {
                            id: true,
                            kode: true,
                            nama: true,
                            kegiatan: {
                              select: {
                                id: true,
                                kode: true,
                                nama: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                list_pencairan: {
                  where: { deleted_at: null },
                  select: {
                    id: true,
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

        panjarStatus = rincianNpd.is_panjar;

        const rekeningData: RekeningLpj[] = [];

        const listItemRincianNpd = rincianNpd.list_item_rincian_npd;

        if (listItemRincianNpd) {
          for (const itemRincianNpd of listItemRincianNpd) {
            let totalBelanja = 0;
            const totalAnggaran =
              Number(itemRincianNpd.rincian_objek.nominal_anggaran) ?? 0;
            const totalAkumulasiBelanja =
              Number(itemRincianNpd.rincian_objek.nominal_realisasi) ?? 0;

            const listPencairan = itemRincianNpd.list_pencairan;

            for (const pencairan of listPencairan) {
              totalBelanja += Number(pencairan.nominal) ?? 0;
            }

            if (totalBelanja > 0 && totalAkumulasiBelanja > 0) {
              rekeningData.push({
                ...itemRincianNpd.rincian_objek.rekening,
                total_anggaran: Number(totalAnggaran),
                total_belanja: Number(totalBelanja),
                total_akumulasi_belanja: Number(totalAkumulasiBelanja),
              });
            }
          }
        }

        rekeningResponse = mergeSameObjectById(rekeningData);
      }

      const lpj = await prisma.lpj.create({
        data: {
          is_panjar: panjarStatus,
          rincian_npd_id: rincianNpdId,
        },
        select: {
          id: true,
          created_at: true,
        },
      });

      return ResponseBuilder.success("LPJ berhasil ditambahkan", {
        ...lpj,
        list_rekening: rekeningResponse,
      });
    } catch (error) {
      return ResponseBuilder.failure(
        "LPJ gagal ditambahkan",
        (error as Error).message,
      );
    }
  },
};
