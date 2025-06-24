import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

import { JWT_NAME } from "@/common/config/constant";
import prisma from "@/common/config/prisma";

const authPlugin = new Elysia({ name: "auth-plugin" })
  .use(jwt({ name: JWT_NAME, secret: process.env.JWT_SECRET || "" }))
  .macro({
    auth: ({
      enabled = true,
      isSuperadmin = false,
    }: {
      enabled?: boolean;
      isSuperadmin?: boolean;
    }) => ({
      async resolve({ jwt, cookie, set }) {
        if (!enabled) return;

        const token = cookie["e-payment"].value;

        if (!token) {
          set.status = 401;
          throw new Error("Token tidak ditemukan");
        }

        const jwtPayload = await jwt.verify(token);
        if (!jwtPayload) {
          set.status = 403;
          throw new Error("Token tidak valid");
        }

        const userId = jwtPayload.sub;
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            role: true,
          },
        });

        if (!user) {
          set.status = 403;
          throw new Error("Token tidak valid");
        }

        if (isSuperadmin && user.role !== "SUPERADMIN") {
          set.status = 401;
          throw new Error("Anda tidak diizinkan untuk mengakses data ini");
        }

        return {
          user: user,
        };
      },
    }),
  });

export { authPlugin };
