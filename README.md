# Sistem Informasi Manajemen Keuangan RSUD Dr. Mohamad Soewhandie Surabaya

Proyek ini dikerjakan untuk memenuhi tugas mata kuliah Pengembangan Sistem dan Teknologi Informasi (Capstone Project).
Adapun dokumentasi API dari proyek ini dapat diakses pada [link berikut](https://capstonebd-backend.it-its.id/api/docs).

## Anggota Kelompok 4

| Nama							  | NRP		   | Peran 	   |
| ------------------------------- | ---------- | --------- |
| Samuel Yuma Krismata 			  | 5027221029 | Fullstack |
| Muhammad Harvian Dito Syahputra | 5027221039 | Frontend  |
| Hafiz Akmaldi Santosa 		  | 5027221061 | UI/UX     |

## Tech Stack

**Frontend**
- React
- Typescript
- Tailwind CSS
- Tanstack Router + Query
- Rspack

**Backend**
- Elysia.js
- Typescript
- Prisma
- Postgres
- Swagger with Scalar API Platform

## Persyaratan

Pastikan tools berikut sudah terinstal di perangkat anda:
- [Bun](https://bun.sh/docs/installation)
- [Docker](https://docs.docker.com/engine/install/)

## Instalasi

### Konfigurasi Environment Variables

Rename semua file `.env.example` yang ada termasuk pada folder frontend dan backend menjadi `.env` lalu atur nilai dari setiap variabelnya sesuai kebutuhan. Contoh:

```env
NODE_ENV="production" # development, production
BE_PORT="8080"
JWT_SECRET="1X2X3X4X5"
PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK="true"

API_URL="http://localhost:8080"
SITE_URL="http://localhost:3000/"

POSTGRES_HOST="postgres" # development: localhost, production: postgres
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="admin"
POSTGRES_DB="dummy_db"
POSTGRES_PORT="5432"

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
```

### Build and Run the App

Untuk menjalankan aplikasi:

```sh
docker-compose up -d --build
```

- Buka `http://localhost:3000/` untuk mengakses halaman **frontend**
- Buka `http://localhost:8080/` untuk mengakses **backend**
- Buka `http://localhost:8080/api/docs` untuk mengakses halaman dokumentasi API

### Migrate and Seed Database

Masuk ke container database:

```sh
docker exec -it simk-soewandhie-backend sh
```

Setelah masuk ke dalam container:

```sh
bun run prisma:deploy && bun run prisma:seed
```

Untuk keluar dari container, gunakan command `exit`

### Login

Gunakan kredensial berikut untuk login:
- **username**: superadmin, **password**: superadmin1234
- **username**: admin, **password**: admin4321