import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns } from './base.entity';

import { 
    sqliteTable, 
    text, 
    integer 
} from 'drizzle-orm/sqlite-core';

export const promotions = sqliteTable('promotions', {
	...baseEntityColumns,
	title: text(),
	description: text(),
    start_date: integer("start_date", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
    end_date: integer("end_date", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
	type: text(),
	is_premium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
});