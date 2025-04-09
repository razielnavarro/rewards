import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns, softDeletableEntityColumns } from './base.entity';
import { relations } from 'drizzle-orm';

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const promotions = sqliteTable('promotions', {
	...baseEntityColumns,
	title: text(),
	description: text(),
	start_date: integer('start_date', { mode: 'timestamp' })
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
	end_date: integer('end_date', { mode: 'timestamp' })
		.default(sql`(strftime('%s', 'now'))`)
		.notNull(),
	promotion_category_type: text(),
	amount: integer('amount').notNull().default(1),
	is_premium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
	...softDeletableEntityColumns,
});
