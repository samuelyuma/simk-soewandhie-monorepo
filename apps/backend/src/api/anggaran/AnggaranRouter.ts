import Elysia, { t } from "elysia";

import { idParams, queryParams } from "@/common/models/params";
import { ResponseSchema } from "@/common/models/responses";
import { authPlugin } from "@/common/plugin/auth";

import { AnggaranController } from "./AnggaranController";
import {
  type CreateEventProps,
  type CreateKegiatanProps,
  type CreateRekeningProps,
  type CreateRincianObjekProps,
  type CreateSubKegiatanProps,
  createEventSchema,
  createKegiatanSchema,
  createRekeningSchema,
  createRincianObjekSchema,
  createSubKegiatanSchema,
  detailEventSchema,
  detailKegiatanSchema,
  detailRekeningSchema,
  detailSubKegiatanSchema,
  eventSchema,
  kegiatanSchema,
  rekeningSchema,
  rincianObjekSchema,
  rincianObjekWithPencairan,
  subKegiatanSchema,
} from "./AnggaranModel";

export const AnggaranRouter = new Elysia().use(authPlugin).guard(
  {
    auth: {},
  },
  (app) =>
    app
      .group("/events", (events) => {
        events.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.addEvent(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Events"],
            detail: {
              summary: "Create Event",
              description: "Add new event data.",
            },
            body: createEventSchema,
            response: {
              200: ResponseSchema.success(
                "Event berhasil dibuat",
                t.Object({
                  ...eventSchema.properties,
                  created_at: t.Date({ default: new Date() }),
                }),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        events.get(
          "/",
          async ({ set }) => {
            const { statusCode, ...response } =
              await AnggaranController.getAllEvents();
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Events"],
            detail: {
              summary: "Get All Event",
              description: "Get all event.",
            },
            response: {
              200: ResponseSchema.success(
                "Daftar event ditemukan",
                t.Array(t.Omit(eventSchema, ["tgl"])),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        events.get(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await AnggaranController.getEventById(Number.parseInt(params.id));
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Events"],
            detail: {
              summary: "Get Event by ID",
              description: "Get event details with list of kegiatan.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Event ditemukan", detailEventSchema),
              404: ResponseSchema.failure("Event tidak ditemukan"),
            },
          },
        );
        events.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.editEvent(
                Number.parseInt(params.id),
                body as Partial<CreateEventProps>,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Events"],
            detail: {
              summary: "Update Event",
              description: "Edit event data based on provided id.",
            },
            params: idParams,
            body: t.Partial(createEventSchema),
            response: {
              200: ResponseSchema.success(
                "Event berhasil diperbarui",
                t.Nullable(
                  t.Object({
                    ...eventSchema.properties,
                    updated_at: t.Date({ default: new Date() }),
                  }),
                ),
              ),
              404: ResponseSchema.failure("Event tidak ditemukan"),
            },
          },
        );
        events.delete(
          "/:id",
          async ({ params }) =>
            AnggaranController.removeEvent(Number.parseInt(params.id)),
          {
            tags: ["Events"],
            detail: {
              summary: "Delete Event",
              description: "Remove event based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Event berhasil dihapus"),
              404: ResponseSchema.failure(),
            },
          },
        );

        return events;
      })
      .group("/kegiatan", (kegiatan) => {
        kegiatan.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.addKegiatan(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Kegiatan"],
            detail: {
              summary: "Create Kegiatan",
              description: "Add new kegiatan data.",
            },
            body: t.Omit(createKegiatanSchema, [
              "total_belanja_kegiatan",
              "total_nominal_kegiatan",
            ]),
            response: {
              200: ResponseSchema.success(
                "Kegiatan berhasil ditambahkan",
                t.Omit(
                  t.Object({
                    ...kegiatanSchema.properties,
                    created_at: t.Date({ default: new Date() }),
                  }),
                  ["total_belanja_kegiatan", "total_nominal_kegiatan"],
                ),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        kegiatan.get(
          "/",
          async ({ set, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getAllKegiatan(query);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Kegiatan"],
            detail: {
              summary: "Get All Kegiatan",
              description: "Get all kegiatan with query params.",
            },
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Daftar kegiatan ditemukan",
                t.Union([t.Array(kegiatanSchema), t.Array(t.Never())]),
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        kegiatan.get(
          "/:id",
          async ({ set, params, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getKegiatanById(
                Number.parseInt(params.id),
                query,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Kegiatan"],
            detail: {
              summary: "Get Kegiatan by ID",
              description:
                "Get kegiatan details with list of sub kegiatan data.",
            },
            params: idParams,
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Kegiatan ditemukan",
                detailKegiatanSchema,
                true,
              ),
              404: ResponseSchema.failure(),
            },
          },
        );
        kegiatan.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.editKegiatan(
                Number.parseInt(params.id),
                body as Partial<CreateKegiatanProps>,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Kegiatan"],
            detail: {
              summary: "Update Kegiatan",
              description: "Edit kegiatan data based on provided id.",
            },
            params: idParams,
            body: t.Partial(createKegiatanSchema),
            response: {
              200: ResponseSchema.success(
                "Kegiatan berhasil diperbarui",
                t.Omit(
                  t.Object({
                    ...kegiatanSchema.properties,
                    updated_at: t.Date({ default: new Date() }),
                  }),
                  ["total_belanja_kegiatan", "total_nominal_kegiatan"],
                ),
              ),
              404: ResponseSchema.failure("Kegiatan tidak ditemukan"),
            },
          },
        );
        kegiatan.delete(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await AnggaranController.removeKegiatan(
                Number.parseInt(params.id),
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Kegiatan"],
            detail: {
              summary: "Delete Kegiatan",
              description: "Remove kegiatan based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Kegiatan berhasil dihapus"),
              404: ResponseSchema.failure("Kegiatan tidak ditemukan"),
            },
          },
        );

        return kegiatan;
      })
      .group("/sub-kegiatan", (subKegiatan) => {
        subKegiatan.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.addSubKegiatan(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Sub Kegiatan"],
            detail: {
              summary: "Create Sub Kegiatan",
              description: "Add new sub kegiatan data.",
            },
            body: createSubKegiatanSchema,
            response: {
              200: ResponseSchema.success(
                "Sub kegiatan berhasil ditambahkan",
                t.Object({
                  ...subKegiatanSchema.properties,
                  created_at: t.Date({ default: new Date() }),
                }),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        subKegiatan.get(
          "/",
          async ({ set, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getAllSubKegiatan(query);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Sub Kegiatan"],
            detail: {
              summary: "Get All Sub Kegiatan",
              description: "Get all sub kegiatan with query params.",
            },
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Daftar sub kegiatan ditemukan",
                t.Union([t.Array(subKegiatanSchema), t.Array(t.Never())]),
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        subKegiatan.get(
          "/:id",
          async ({ set, params, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getSubKegiatanById(
                Number.parseInt(params.id),
                query,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Sub Kegiatan"],
            detail: {
              summary: "Get Sub Kegiatan by ID",
              description:
                "Get sub kegiatan details with list of rekening data.",
            },
            params: idParams,
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Sub kegiatan ditemukan",
                detailSubKegiatanSchema,
                true,
              ),
              404: ResponseSchema.failure("Sub kegiatan tidak ditemukan"),
            },
          },
        );
        subKegiatan.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.editSubKegiatan(
                Number.parseInt(params.id),
                body as Partial<CreateSubKegiatanProps>,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Sub Kegiatan"],
            detail: {
              summary: "Update Sub Kegiatan",
              description: "Edit Sub kegiatan data based on provided id.",
            },
            params: idParams,
            body: t.Partial(createSubKegiatanSchema),
            response: {
              200: ResponseSchema.success(
                "Sub kegiatan berhasil diperbarui",
                t.Object({
                  ...subKegiatanSchema.properties,
                  updated_at: t.Date({ default: new Date() }),
                }),
              ),
              404: ResponseSchema.failure("Sub kegiatan tidak ditemukan"),
            },
          },
        );
        subKegiatan.delete(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await AnggaranController.removeSubKegiatan(
                Number.parseInt(params.id),
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Sub Kegiatan"],
            detail: {
              summary: "Delete Sub Kegiatan",
              description: "Remove sub kegiatan based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Sub kegiatan berhasil dihapus"),
              404: ResponseSchema.failure("Sub kegiatan tidak ditemukan"),
            },
          },
        );

        return subKegiatan;
      })
      .group("/rekening", (rekening) => {
        rekening.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.addRekening(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rekening"],
            detail: {
              summary: "Create Rekening",
              description: "Add new rekening data.",
            },
            body: createRekeningSchema,
            response: {
              200: ResponseSchema.success(
                "Rekening berhasil ditambahkan",
                t.Omit(
                  t.Object({
                    ...rekeningSchema.properties,
                    created_at: t.Date({ default: new Date() }),
                  }),
                  ["total_belanja_rekening", "total_nominal_rekening"],
                ),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rekening.get(
          "/",
          async ({ set, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getALlRekening(query);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rekening"],
            detail: {
              summary: "Get All Rekening",
              description: "Get all rekening with query params.",
            },
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Daftar rekening ditemukan",
                t.Union([t.Array(rekeningSchema), t.Array(t.Never())]),
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rekening.get(
          "/:id",
          async ({ set, params, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getRekeningById(
                Number.parseInt(params.id),
                query,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rekening"],
            detail: {
              summary: "Get Rekening by ID",
              description:
                "Get rekening details with list of rincian objek data.",
            },
            query: queryParams,
            params: idParams,
            response: {
              200: ResponseSchema.success(
                "Rekening ditemukan",
                detailRekeningSchema,
                true,
              ),
              404: ResponseSchema.failure("Rekening tidak ditemukan"),
            },
          },
        );
        rekening.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.editRekening(
                Number.parseInt(params.id),
                body as Partial<CreateRekeningProps>,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rekening"],
            detail: {
              summary: "Update Rekening",
              description: "Edit rekening data based on provided id.",
            },
            params: idParams,
            body: t.Partial(createSubKegiatanSchema),
            response: {
              200: ResponseSchema.success(
                "Rekening berhasil diperbarui",
                t.Omit(
                  t.Object({
                    ...createRekeningSchema.properties,
                    updated_at: t.Date({ default: new Date() }),
                  }),
                  ["total_belanja_rekening", "total_nominal_rekening"],
                ),
              ),
              404: ResponseSchema.failure("Rekening tidak ditemukan"),
            },
          },
        );
        rekening.delete(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await AnggaranController.removeSubKegiatan(
                Number.parseInt(params.id),
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rekening"],
            detail: {
              summary: "Delete Rekening",
              description: "Remove rekening based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Rekening berhasil dihapus"),
              404: ResponseSchema.failure("Rekening tidak ditemukan"),
            },
          },
        );

        return rekening;
      })
      .group("/rincian-objek", (rincianObjek) => {
        rincianObjek.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.addRincianObjek(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian Objek"],
            detail: {
              summary: "Create Rincian Objek",
              description: "Add new rincian objek data.",
            },
            body: createRincianObjekSchema,
            response: {
              200: ResponseSchema.success(
                "Rincian objek berhasil ditambahkan",
                t.Object({
                  ...rincianObjekSchema.properties,
                  created_at: t.Date({ default: new Date() }),
                }),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rincianObjek.get(
          "/",
          async ({ set, query }) => {
            const { statusCode, ...response } =
              await AnggaranController.getAllRincianObjek(query);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian Objek"],
            detail: {
              summary: "Get All Rincian Objek",
              description: "Get all rincian objek with query params.",
            },
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Daftar rincian objek ditemukan",
                t.Union([
                  t.Array(rincianObjekWithPencairan),
                  t.Array(t.Never()),
                ]),
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rincianObjek.get(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await AnggaranController.getRincianObjekById(
                Number.parseInt(params.id),
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian Objek"],
            detail: {
              summary: "Get Rincian Objek by ID",
              description: "Get rincian objek details.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success(
                "Rincian objek ditemukan",
                rincianObjekSchema,
              ),
              404: ResponseSchema.failure("Rincian objek tidak ditemukan"),
            },
          },
        );
        rincianObjek.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await AnggaranController.editRincianObjek(
                Number.parseInt(params.id),
                body as Partial<CreateRincianObjekProps>,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian Objek"],
            detail: {
              summary: "Update Rincian Objek",
              description: "Edit rincian objek data based on provided id.",
            },
            params: idParams,
            body: t.Partial(createRincianObjekSchema),
            response: {
              200: ResponseSchema.success(
                "Rincian objek berhasil diperbarui",
                t.Object({
                  ...rincianObjekSchema.properties,
                  updated_at: t.Date({ default: new Date() }),
                }),
              ),
              404: ResponseSchema.failure("Rincian objek tidak ditemukan"),
            },
          },
        );
        rincianObjek.delete(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await AnggaranController.removeRincianObjek(
                Number.parseInt(params.id),
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian Objek"],
            detail: {
              summary: "Delete Rincian Objek",
              description: "Remove rincian objek based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Rincian objek berhasil dihapus"),
              404: ResponseSchema.failure("Rincian objek tidak ditemukan"),
            },
          },
        );

        return rincianObjek;
      }),
);
