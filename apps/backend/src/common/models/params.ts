import { t } from "elysia";

export const idParams = t.Object({
  id: t.String(),
});

export const queryParams = t.Object({
  page: t.Number({ default: 1 }),
  limit: t.Number({ default: 10 }),
  sort_by: t.Optional(t.String()),
  sort_order: t.Optional(t.Enum({ asc: "asc", desc: "desc" })),
  filter_by: t.Optional(t.String()),
  filter_value: t.Optional(
    t.Union([
      t.String(),
      t.Number(),
      t.Boolean(),
      t.Date(),
      t.Array(t.Union([t.String(), t.Number(), t.Boolean(), t.Date()])),
    ]),
  ),
  search: t.Optional(t.String()),
});

export type QueryParams = typeof queryParams.static;
