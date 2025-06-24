import { t } from "elysia";

export const userSchema = t.Object({
  id: t.String(),
  nama: t.String(),
  username: t.String(),
  password: t.String(),
  nip: t.String(),
  is_active: t.Boolean(),
  role: t.Enum({ ADMIN: "ADMIN", SUPERADMIN: "SUPERADMIN" }),
});

export const jabatanSchema = t.Object({
  id: t.Number(),
  nama: t.String(),
  keterangan: t.Nullable(t.String()),
});

export const userDetailSchema = t.Object({
  ...userSchema.properties,
  list_jabatan: t.Optional(
    t.Union([
      t.Array(t.Object({ id: t.Number(), jabatan: jabatanSchema })),
      t.Array(t.Never()),
    ]),
  ),
});

export const userJabatanSchema = t.Object({
  id: t.Number(),
  jabatan_id: t.Number(),
});

export const createUserSchema = t.Omit(
  t.Object({
    ...userSchema.properties,
    list_jabatan: t.Optional(t.Array(t.Omit(userJabatanSchema, ["id"]))),
  }),
  ["id", "role"],
);

export const updateUserSchema = t.Optional(
  t.Intersect([
    t.Omit(t.Partial(userSchema), ["id", "role"]),
    t.Object({
      list_jabatan: t.Optional(t.Array(userJabatanSchema)),
      new_jabatan_list: t.Optional(
        t.Array(t.Object({ jabatan_id: t.Number() })),
      ),
      removed_jabatan_list: t.Optional(t.Array(t.Object({ id: t.Number() }))),
    }),
  ]),
);

export type UserDetailProps = typeof userDetailSchema.static;

export type CreateUserProps = typeof createUserSchema.static;

export type UpdateUserProps = typeof updateUserSchema.static;

export type UserJabatan = typeof userJabatanSchema.static;
