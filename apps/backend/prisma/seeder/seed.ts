import { PrismaClient } from "../../src/generated/prisma";
import {
  EventData,
  KegiatanData,
  RekeningData,
  RincianObjekData,
  SubKegiatanData,
} from "./data/anggaran";
import {
  ItemRincianNpdData,
  NpdData,
  NpdRincianData,
  PencairanData,
} from "./data/npd";
import { JabatanData, MapUserJabatanData, UserData } from "./data/user";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database begins...");

  //#region  //*============================ User ============================
  await Promise.all(
    UserData.map(async (user) =>
      prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          ...user,
          password: await Bun.password.hash(user.password, "bcrypt"),
        },
      }),
    ),
  );

  await Promise.all(
    JabatanData.map(async (jabatan) =>
      prisma.jabatan.upsert({
        where: { id: jabatan.id },
        update: {},
        create: jabatan,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('jabatan', 'id'), coalesce(max(id)+1, 1), false) FROM jabatan;`;

  await Promise.all(
    MapUserJabatanData.map(async (userJabatan) =>
      prisma.userJabatan.upsert({
        where: { id: userJabatan.id },
        update: {},
        create: userJabatan,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('map_user_jabatan', 'id'), coalesce(max(id)+1, 1), false) FROM map_user_jabatan;`;
  //#endregion  //*========================= User ============================

  //#region  //*============================ Anggaran ============================
  await Promise.all(
    EventData.map(async (event) =>
      prisma.event.upsert({
        where: { id: event.id },
        update: {},
        create: event,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('event', 'id'), coalesce(max(id)+1, 1), false) FROM event;`;

  await Promise.all(
    KegiatanData.map(async (kegiatan) =>
      prisma.kegiatan.upsert({
        where: { id: kegiatan.id },
        update: {},
        create: kegiatan,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('kegiatan', 'id'), coalesce(max(id)+1, 1), false) FROM kegiatan;`;

  await Promise.all(
    SubKegiatanData.map(async (subKegiatan) =>
      prisma.subKegiatan.upsert({
        where: { id: subKegiatan.id },
        update: {},
        create: subKegiatan,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('sub_kegiatan', 'id'), coalesce(max(id)+1, 1), false) FROM sub_kegiatan;`;

  await Promise.all(
    RekeningData.map(async (rekening) =>
      prisma.rekening.upsert({
        where: { id: rekening.id },
        update: {},
        create: rekening,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('rekening', 'id'), coalesce(max(id)+1, 1), false) FROM rekening;`;

  await Promise.all(
    RincianObjekData.map(async (rincianObjek) =>
      prisma.rincianObjek.upsert({
        where: { id: rincianObjek.id },
        update: {},
        create: rincianObjek,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('rincian_objek', 'id'), coalesce(max(id)+1, 1), false) FROM rincian_objek;`;
  //#endregion  //*========================= Anggaran ============================

  //#region  //*============================ NPD ============================
  await Promise.all(
    NpdData.map(async (npd) =>
      prisma.npd.upsert({
        where: { id: npd.id },
        update: {},
        create: npd,
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('npd', 'id'), coalesce(max(id)+1, 1), false) FROM npd;`;

  if (process.env.NODE_ENV !== "production") {
    await Promise.all(
      NpdRincianData.map(async (npdRincian) =>
        prisma.npdRincian.upsert({
          where: { id: npdRincian.id },
          update: {},
          create: npdRincian,
        }),
      ),
    );
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('npd_rincian', 'id'), coalesce(max(id)+1, 1), false) FROM npd_rincian;`;

    await Promise.all(
      ItemRincianNpdData.map(async (itemRincianNpd) =>
        prisma.itemRincianNpd.upsert({
          where: { id: itemRincianNpd.id },
          update: {},
          create: itemRincianNpd,
        }),
      ),
    );
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('item_rincian_npd', 'id'), coalesce(max(id)+1, 1), false) FROM item_rincian_npd;`;

    await Promise.all(
      PencairanData.map(async (pencairan) =>
        prisma.pencairan.upsert({
          where: { id: pencairan.id },
          update: {},
          create: pencairan,
        }),
      ),
    );
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('pencairan', 'id'), coalesce(max(id)+1, 1), false) FROM pencairan;`;

    await Promise.all(
      ItemRincianNpdData.map(async (itemRincianNpd) => {
        const realisasi = await prisma.pencairan.aggregate({
          where: {
            item_rincian_npd: {
              rincian_objek_id: itemRincianNpd.rincian_objek_id,
            },
            deleted_at: null,
          },
          _sum: {
            nominal: true,
          },
        });

        await prisma.rincianObjek.update({
          where: { id: itemRincianNpd.rincian_objek_id },
          data: {
            nominal_realisasi: realisasi._sum.nominal || 0n,
          },
        });
      }),
    );
  }
  //#endregion  //*========================= NPD ============================
}

main()
  .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Database seeded successfully. Closing connection.");
    await prisma.$disconnect();
  });
