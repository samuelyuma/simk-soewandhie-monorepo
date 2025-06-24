import { type TSchema, t } from "elysia";

export const ResponseSchema = {
  success: <T extends TSchema>(message?: string, data?: T, withMeta = false) =>
    t.Object({
      success: t.Boolean({ default: true }),
      message: t.String({ default: message ?? "Success response" }),
      ...(data
        ? withMeta
          ? {
              data: t.Object({
                data,
                meta: t.Object({
                  current_page: t.Number({ default: 1 }),
                  total_records: t.Number({ default: 0 }),
                  total_pages: t.Number({ default: 1 }),
                  has_next_page: t.Boolean({ default: false }),
                  has_prev_page: t.Boolean({ default: false }),
                  next_page: t.Nullable(t.Number(), { default: null }),
                  prev_page: t.Nullable(t.Number(), { default: null }),
                }),
              }),
            }
          : { data }
        : {}),
    }),
  failure: (error?: string) =>
    t.Object({
      success: t.Boolean({ default: false }),
      message: t.String({ default: "Terjadi kesalahan" }),
      error: t.Optional(
        t.Union([t.String({ default: error ?? "Error" }), t.Array(t.String())]),
      ),
    }),
};
