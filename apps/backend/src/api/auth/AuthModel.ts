import { t } from "elysia";

import { jabatanSchema } from "../user/UserModel";

export const loginSchema = t.Object({
  username: t.String({ minLength: 1, error: "Username harus diisi" }),
  password: t.String({ minLength: 1, error: "Password harus diisi" }),
});

export const loginResponseSchema = t.Object({
  token: t.String(),
  role: t.Enum({ ADMIN: "ADMIN", SUPERADMIN: "SUPERADMIN" }),
  list_jabatan: t.Optional(
    t.Union([
      t.Array(t.Object({ id: t.Number(), jabatan: jabatanSchema })),
      t.Array(t.Never()),
    ]),
  ),
});

export type LoginProps = typeof loginSchema.static;
