-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "tgl" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kegiatan" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(25) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_kegiatan" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "kegiatan_id" INTEGER NOT NULL,
    "kode" VARCHAR(25) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sub_kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rekening" (
    "id" SERIAL NOT NULL,
    "sub_kegiatan_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "kode" VARCHAR(25) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rekening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rincian_objek" (
    "id" SERIAL NOT NULL,
    "rekening_id" INTEGER NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "nominal_anggaran" BIGINT NOT NULL,
    "nominal_realisasi" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rincian_objek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lpj" (
    "id" SERIAL NOT NULL,
    "rincian_npd_id" INTEGER,
    "is_panjar" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Lpj_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npd" (
    "id" SERIAL NOT NULL,
    "kpa_id" TEXT NOT NULL,
    "kegiatan_id" INTEGER NOT NULL,
    "sub_kegiatan_id" INTEGER NOT NULL,
    "program" VARCHAR(255) NOT NULL,
    "no_dpa" VARCHAR(50) NOT NULL,
    "tahun" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "npd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npd_rincian" (
    "id" SERIAL NOT NULL,
    "npd_id" INTEGER NOT NULL,
    "pptk_id" TEXT NOT NULL,
    "no" INTEGER NOT NULL,
    "is_panjar" BOOLEAN NOT NULL,
    "is_fix" BOOLEAN NOT NULL DEFAULT false,
    "keperluan" VARCHAR(255),
    "alasan_batal" VARCHAR(255),
    "batal_pada" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "npd_rincian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_rincian_npd" (
    "id" SERIAL NOT NULL,
    "npd_rincian_id" INTEGER NOT NULL,
    "rincian_objek_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "item_rincian_npd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pencairan" (
    "id" SERIAL NOT NULL,
    "item_rincian_npd_id" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominal" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pencairan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengguna" (
    "id" VARCHAR(18) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "nip" VARCHAR(20) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "keterangan" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_user_jabatan" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(18) NOT NULL,
    "jabatan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "map_user_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_username_key" ON "pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "map_user_jabatan_user_id_jabatan_id_key" ON "map_user_jabatan"("user_id", "jabatan_id");

-- AddForeignKey
ALTER TABLE "sub_kegiatan" ADD CONSTRAINT "sub_kegiatan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_kegiatan" ADD CONSTRAINT "sub_kegiatan_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rekening" ADD CONSTRAINT "rekening_sub_kegiatan_id_fkey" FOREIGN KEY ("sub_kegiatan_id") REFERENCES "sub_kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rekening" ADD CONSTRAINT "rekening_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rincian_objek" ADD CONSTRAINT "rincian_objek_rekening_id_fkey" FOREIGN KEY ("rekening_id") REFERENCES "rekening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lpj" ADD CONSTRAINT "Lpj_rincian_npd_id_fkey" FOREIGN KEY ("rincian_npd_id") REFERENCES "npd_rincian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npd" ADD CONSTRAINT "npd_kpa_id_fkey" FOREIGN KEY ("kpa_id") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npd" ADD CONSTRAINT "npd_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npd" ADD CONSTRAINT "npd_sub_kegiatan_id_fkey" FOREIGN KEY ("sub_kegiatan_id") REFERENCES "sub_kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npd_rincian" ADD CONSTRAINT "npd_rincian_npd_id_fkey" FOREIGN KEY ("npd_id") REFERENCES "npd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npd_rincian" ADD CONSTRAINT "npd_rincian_pptk_id_fkey" FOREIGN KEY ("pptk_id") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_rincian_npd" ADD CONSTRAINT "item_rincian_npd_npd_rincian_id_fkey" FOREIGN KEY ("npd_rincian_id") REFERENCES "npd_rincian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_rincian_npd" ADD CONSTRAINT "item_rincian_npd_rincian_objek_id_fkey" FOREIGN KEY ("rincian_objek_id") REFERENCES "rincian_objek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pencairan" ADD CONSTRAINT "pencairan_item_rincian_npd_id_fkey" FOREIGN KEY ("item_rincian_npd_id") REFERENCES "item_rincian_npd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_user_jabatan" ADD CONSTRAINT "map_user_jabatan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_user_jabatan" ADD CONSTRAINT "map_user_jabatan_jabatan_id_fkey" FOREIGN KEY ("jabatan_id") REFERENCES "jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
