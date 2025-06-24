import Elysia, { t } from "elysia";

import { idParams, queryParams } from "@/common/models/params";
import { ResponseSchema } from "@/common/models/responses";
import { pencairanSchema, rincianNpdSchema } from "@/common/models/shared";
import { authPlugin } from "@/common/plugin/auth";

import { NpdController } from "./NpdController";
import {
  type CreatePencairanProps,
  createPencairanSchema,
  createRincianNpdSchema,
  detailNpdSchema,
  detailRincianNpdSchema,
  type UpdateRincianNpdProps,
  updateRincianNpdSchema,
} from "./NpdModel";

export const NpdRouter = new Elysia().use(authPlugin).guard(
  {
    auth: {},
  },
  (app) =>
    app
      .group("/rincian-npd", (rincianNpd) => {
        rincianNpd.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await NpdController.addRincianNpd(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian NPD"],
            detail: {
              summary: "Create Rincian NPD",
              description: "Add new rincian NPD data.",
            },
            body: createRincianNpdSchema,
            response: {
              200: ResponseSchema.success(
                "Rincian NPD berhasil dibuat",
                t.Object({
                  ...rincianNpdSchema.properties,
                  created_at: t.Date({ default: new Date() }),
                }),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rincianNpd.get(
          "/",
          async ({ set, query }) => {
            const { statusCode, ...response } =
              await NpdController.getAllRincianNpd(query);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian NPD"],
            detail: {
              summary: "Get All Rincian NPD",
              description: "Get all rincian NPD with query params.",
            },
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Daftar rincian NPD ditemukan",
                detailNpdSchema,
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rincianNpd.get(
          "/:id",
          async ({ set, params, query }) => {
            const { statusCode, ...response } =
              await NpdController.getRincianNpdById(
                Number.parseInt(params.id),
                query,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian NPD"],
            detail: {
              summary: "Get Rincian NPD by ID",
              description: "Get rincian NPD details.",
            },
            params: idParams,
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Rincian NPD ditemukan",
                t.Object({
                  ...detailRincianNpdSchema.properties,
                  created_at: t.Date({ default: new Date() }),
                }),
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        rincianNpd.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await NpdController.editRincianNpd(
                Number.parseInt(params.id),
                body as UpdateRincianNpdProps,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian NPD"],
            detail: {
              summary: "Update Rincian NPD",
              description: "Edit rincian NPD data based on provided id.",
            },
            params: idParams,
            body: updateRincianNpdSchema,
            response: {
              200: ResponseSchema.success(
                "Rincian NPD berhasil diperbarui",
                t.Object({
                  ...rincianNpdSchema.properties,
                  updated_at: t.Date({ default: new Date() }),
                }),
              ),
              404: ResponseSchema.failure("Rincian NPD tidak ditemukan"),
            },
          },
        );
        rincianNpd.delete(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await NpdController.removeRincianNpd(Number.parseInt(params.id));
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Rincian NPD"],
            detail: {
              summary: "Delete Rincian NPD",
              description: "Remove rincian NPD based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Rincian NPD berhasil dihapus"),
              404: ResponseSchema.failure("Rincian NPD tidak ditemukan"),
            },
          },
        );
        return rincianNpd;
      })
      .group("/pencairan", (pencairan) => {
        pencairan.post(
          "/",
          async ({ set, body }) => {
            const { statusCode, ...response } =
              await NpdController.addPencairan(body);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Pencairan"],
            detail: {
              summary: "Create Pencairan",
              description: "Add new pencairan data.",
            },
            body: createPencairanSchema,
            response: {
              200: ResponseSchema.success(
                "Pencairan berhasil ditambahkan",
                t.Omit(
                  t.Object({
                    ...pencairanSchema.properties,
                    created_at: t.Date({ default: new Date() }),
                  }),
                  ["updated_at"],
                ),
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        pencairan.get(
          "/",
          async ({ set, query }) => {
            const { statusCode, ...response } =
              await NpdController.getAllPencairan(query);
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Pencairan"],
            detail: {
              summary: "Get All Pencairan",
              description: "Get all pencairan with query params.",
            },
            query: queryParams,
            response: {
              200: ResponseSchema.success(
                "Daftar pencairan ditemukan",
                t.Union([t.Array(pencairanSchema), t.Array(t.Never())]),
                true,
              ),
              500: ResponseSchema.failure(),
            },
          },
        );
        pencairan.get(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await NpdController.getPencairanById(Number.parseInt(params.id));
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Pencairan"],
            detail: {
              summary: "Get Pencairan by ID",
              description: "Get pencairan details.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success(
                "Pencairan ditemukan",
                pencairanSchema,
              ),
              404: ResponseSchema.failure("Pencairan tidak ditemukan"),
            },
          },
        );
        pencairan.patch(
          "/:id",
          async ({ set, params, body }) => {
            const { statusCode, ...response } =
              await NpdController.editPencairan(
                Number.parseInt(params.id),
                body as Partial<CreatePencairanProps>,
              );
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Pencairan"],
            detail: {
              summary: "Update Pencairan",
              description: "Edit pencairan data based on provided id.",
            },
            params: idParams,
            body: t.Partial(createPencairanSchema),
            response: {
              200: ResponseSchema.success(
                "Pencairan berhasil diperbarui",
                t.Object({
                  ...pencairanSchema.properties,
                  updated_at: t.Date({ default: new Date() }),
                }),
              ),
              404: ResponseSchema.failure("Pencairan tidak ditemukan"),
            },
          },
        );
        pencairan.delete(
          "/:id",
          async ({ set, params }) => {
            const { statusCode, ...response } =
              await NpdController.removePencairan(Number.parseInt(params.id));
            set.status = statusCode;
            return response;
          },
          {
            tags: ["Pencairan"],
            detail: {
              summary: "Delete Pencairan",
              description: "Remove pencairan based on provided id.",
            },
            params: idParams,
            response: {
              200: ResponseSchema.success("Pencairan berhasil dihapus"),
              404: ResponseSchema.failure("Pencairan tidak ditemukan"),
            },
          },
        );
        return pencairan;
      }),
);
