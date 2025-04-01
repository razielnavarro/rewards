import { type ColumnBaseConfig, sql } from "drizzle-orm";
import { type SQLiteColumn, integer, text } from "drizzle-orm/sqlite-core";

import { generateId } from "../utils/random";

export type BaseEntity = {
  id: SQLiteColumn<ColumnBaseConfig<"string", string>, object>;
  createdAt: SQLiteColumn<ColumnBaseConfig<"date", string>, object>;
  updatedAt: SQLiteColumn<ColumnBaseConfig<"date", string>, object>;
};

export type SoftDeletableEntity = {
  deletedAt: SQLiteColumn<ColumnBaseConfig<"date", string>, object>;
} & BaseEntity;

export const baseEntityColumns = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
};

export const softDeletableEntityColumns = {
  ...baseEntityColumns,
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
};