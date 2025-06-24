import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { env } from "@yolk-oss/elysia-env";
import { Elysia, t } from "elysia";

import { AnggaranRouter } from "./api/anggaran/AnggaranRouter";
import { AuthRouter } from "./api/auth/AuthRouter";
import { LpjRouter } from "./api/lpj/LpjRouter";
import { NpdRouter } from "./api/npd/NpdRouter";
import { UserRouter } from "./api/user/UserRouter";

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      maxAge: 86400,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
  )
  .use(
    env({
      NODE_ENV: t.Enum(
        {
          development: "development",
          production: "production",
          test: "test",
        },
        { default: "development" },
      ),
      BE_PORT: t.String({ minLength: 1, error: "BE_PORT (PORT) is required" }),
      CLIENT_ORIGIN: t.String({ default: "*" }),
      JWT_SECRET: t.String({ minLength: 1, error: "JWT_SECRET is required" }),
      DATABASE_URL: t.String({
        minLength: 1,
        error: "DATABASE_URL is required",
      }),
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "SIM Keuangan RSUD Dr. Soewandhie",
          description: "API documentation.",
          version: "0.0.1",
        },
        tags: [
          {
            name: "Auth",
            description: "Endpoints related to auth.",
          },
          {
            name: "User",
            description: "Endpoints related to user.",
          },
          {
            name: "Jabatan",
            description: "Endpoints related to jabatan.",
          },
          {
            name: "Events",
            description: "Endpoints related to events.",
          },
          {
            name: "Kegiatan",
            description: "Endpoints related to kegiatan.",
          },
          {
            name: "Sub Kegiatan",
            description: "Endpoints related to sub kegiatan.",
          },
          {
            name: "Rekening",
            description: "Endpoints related to rekening.",
          },
          {
            name: "Rincian Objek",
            description: "Endpoints related to rincian objek.",
          },
          {
            name: "Pencairan",
            description: "Endpoints related to pencairan.",
          },
          {
            name: "Rincian NPD",
            description: "Endpoints related to rincian NPD.",
          },
          {
            name: "LPJ",
            description: "Endpoints related to LPJ.",
          },
        ],
      },
      path: "/api/docs",
    }),
  )
  .onError(({ code, set }) => {
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return {
          success: false,
          message: "Terjadi kesalahan",
          error: "Endpoint tidak ditemukan",
        };
    }
  })
  .get("/", () => {
    return {
      success: true,
      message: {
        app: "Sistem Informasi Manajemen Keuangan RSUD dr. Soewhandie Surabaya",
        version: 1,
      },
    };
  })
  .get(
    "/health-check",
    () => {
      return {
        success: true,
        message: new Date(),
      };
    },
    {
      tags: ["Health Check"],
      detail: {
        summary: "Health Check",
      },
    },
  )
  .group("/api", (app) =>
    app
      .use(AuthRouter)
      .use(AnggaranRouter)
      .use(NpdRouter)
      .use(UserRouter)
      .use(LpjRouter),
  )
  .listen(process.env.BE_PORT || 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
