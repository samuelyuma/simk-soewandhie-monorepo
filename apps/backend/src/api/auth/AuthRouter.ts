import jwt from "@elysiajs/jwt";
import type Elysia from "elysia";
import { t } from "elysia";

import { JWT_NAME, TOKEN_EXP } from "@/common/config/constant";
import { ResponseSchema } from "@/common/models/responses";
import { authPlugin } from "@/common/plugin/auth";
import { ResponseBuilder } from "@/common/utils/builder";

import { userDetailSchema } from "../user/UserModel";
import { AuthController } from "./AuthController";
import { type LoginProps, loginResponseSchema, loginSchema } from "./AuthModel";

export const AuthRouter = (app: Elysia) => {
  return app
    .use(
      jwt({
        name: JWT_NAME,
        secret: process.env.JWT_SECRET || "",
      }),
    )
    .group("/auth", (auth) => {
      auth.post(
        "/login",
        async ({ body, jwt, cookie, set }) => {
          const user = await AuthController.loginUser(body as LoginProps);
          if (!user || "success" in user) {
            set.status = 401;
            return {
              success: false,
              message: "Login gagal",
              error: "Kredensial tidak valid",
            };
          }

          if (!user.is_active) {
            set.status = 401;
            return {
              success: false,
              message: "Login gagal",
              error: "User belum aktif",
            };
          }

          const matchedPassword = await Bun.password.verify(
            body.password,
            user.password,
            "bcrypt",
          );

          if (!matchedPassword) {
            set.status = 401;
            return {
              success: false,
              message: "Login gagal",
              error: "Kredensial tidak valid",
            };
          }

          const [jwtToken, responseData] = await Promise.all([
            jwt.sign({
              sub: user.id,
              exp: TOKEN_EXP,
              iat: Math.floor(Date.now() / 1000),
            }),
            Promise.resolve({
              role: user.role,
              ...(user.list_mapping_jabatan &&
              user.list_mapping_jabatan.length > 0
                ? { list_jabatan: user.list_mapping_jabatan }
                : undefined),
            }),
          ]);

          cookie["e-payment"].set({
            value: jwtToken,
            httpOnly: true,
            maxAge: TOKEN_EXP,
            sameSite: "lax",
            path: "/",
            secure: true,
          });

          set.status = 200;
          return ResponseBuilder.success("Login berhasil", {
            ...responseData,
            token: jwtToken,
          });
        },
        {
          tags: ["Auth"],
          detail: {
            summary: "Login",
            description: "Login using existing credential.",
          },
          body: loginSchema,
          response: {
            200: ResponseSchema.success("Login berhasil", loginResponseSchema),
            401: ResponseSchema.failure(),
          },
        },
      );
      auth.use(authPlugin).get(
        "/me",
        async ({ user, set }) => {
          const { statusCode, ...response } =
            await AuthController.getCurrentUser(user.id);
          set.status = statusCode;
          return response;
        },
        {
          auth: {},
          tags: ["Auth"],
          detail: {
            summary: "Get Current User (Me)",
            description: "Get the detail data of current user.",
          },
          response: {
            200: ResponseSchema.success(
              "Berhasil mendapatkan data user saat ini",
              t.Omit(userDetailSchema, ["password", "is_active"]),
            ),
            401: ResponseSchema.failure("Token tidak ditemukan"),
            403: ResponseSchema.failure("Token tidak valid"),
          },
        },
      );

      return auth;
    });
};
