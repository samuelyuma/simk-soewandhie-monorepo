import Elysia, { t } from "elysia";

import { idParams, queryParams } from "@/common/models/params";
import { ResponseSchema } from "@/common/models/responses";
import { authPlugin } from "@/common/plugin/auth";

import { UserController } from "./UserController";
import {
  createUserSchema,
  jabatanSchema,
  type UpdateUserProps,
  updateUserSchema,
  userDetailSchema,
  userJabatanSchema,
  userSchema,
} from "./UserModel";

export const UserRouter = new Elysia()
  .use(authPlugin)
  .group("/user", (user) => {
    user.post(
      "/",
      async ({ set, body }) => {
        const { statusCode, ...response } = await UserController.addUser(body);
        set.status = statusCode;
        return response;
      },
      {
        auth: {
          isSuperadmin: true,
        },
        tags: ["User"],
        detail: {
          summary: "Create User",
          description: "Add new user data.",
        },
        body: createUserSchema,
        response: {
          200: ResponseSchema.success(
            "Pengguna berhasil dibuat",
            t.Intersect([
              t.Pick(createUserSchema, ["id", "nama"]),
              t.Object({
                created_at: t.Date({ default: new Date() }),
              }),
            ]),
          ),
          500: ResponseSchema.failure(),
        },
      },
    );
    user.get(
      "/",
      async ({ set, query }) => {
        const { statusCode, ...response } =
          await UserController.getAllUsers(query);
        set.status = statusCode;
        return response;
      },
      {
        auth: {},
        tags: ["User"],
        detail: {
          summary: "Get All User",
          description: "Get all user with query params.",
        },
        query: queryParams,
        response: {
          200: ResponseSchema.success(
            "Daftar pengguna berhasil ditemukan",
            t.Array(t.Omit(userDetailSchema, ["role", "password"])),
            true,
          ),
          500: ResponseSchema.failure(),
        },
      },
    );
    user.patch(
      "/:id",
      async ({ set, params, body }) => {
        const { statusCode, ...response } = await UserController.editUser(
          params.id,
          body as UpdateUserProps,
        );
        set.status = statusCode;
        return response;
      },
      {
        auth: {},
        tags: ["User"],
        detail: {
          summary: "Update User",
          description: "Edit user data based on provided id.",
        },
        params: idParams,
        body: updateUserSchema,
        response: {
          200: ResponseSchema.success(
            "Pengguna berhasil diperbarui",
            t.Intersect([
              t.Pick(userSchema, ["id", "nama"]),
              t.Object({
                list_mapping_jabatan: t.Optional(t.Array(userJabatanSchema)),
                updated_at: t.Date({ default: new Date() }),
              }),
            ]),
          ),
          404: ResponseSchema.failure(),
        },
      },
    );
    return user;
  })
  .group("/jabatan", (jabatan) => {
    jabatan.get(
      "/",
      async ({ set, query }) => {
        const { statusCode, ...response } =
          await UserController.getAllJabatan(query);
        set.status = statusCode;
        return response;
      },
      {
        auth: {},
        tags: ["Jabatan"],
        detail: {
          summary: "Get All Jabatan",
          description: "Get all jabatan with query params.",
        },
        query: queryParams,
        response: {
          200: ResponseSchema.success(
            "Daftar jabatan berhasil ditemukan",
            t.Array(jabatanSchema),
            true,
          ),
          500: ResponseSchema.failure(),
        },
      },
    );
    return jabatan;
  });
