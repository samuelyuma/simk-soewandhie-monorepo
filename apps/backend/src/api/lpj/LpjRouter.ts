import Elysia from "elysia";

import { ResponseSchema } from "@/common/models/responses";
import { authPlugin } from "@/common/plugin/auth";

import { LpjController } from "./LpjController";
import { createLpjSchema, lpjSchema } from "./LpjModel";

export const LpjRouter = new Elysia().use(authPlugin).group("/lpj", (lpj) => {
  lpj.post(
    "/",
    async ({ set, body }) => {
      const { statusCode, ...response } = await LpjController.createLpj(body);
      set.status = statusCode;
      return response;
    },
    {
      auth: {},
      tags: ["LPJ"],
      detail: {
        summary: "Generate LPJ",
        description: "Generate new LPJ data.",
      },
      body: createLpjSchema,
      response: {
        201: ResponseSchema.success("LPJ berhasil ditambahkan", lpjSchema),
        422: ResponseSchema.failure(),
        500: ResponseSchema.failure(),
      },
    },
  );

  return lpj;
});
