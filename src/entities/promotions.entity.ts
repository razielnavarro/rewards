import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns } from './base.entity';
import { promotionsCategory } from './promotionsCategory.entity';
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
	promotion_category_id: text('promotion_category_id')
		.notNull()
		.references(() => promotionsCategory.id),
	is_premium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
});

export const promotionsRelations = relations(promotions, ({ one }) => ({
	category: one(promotionsCategory, {
		fields: [promotions.promotion_category_id],
		references: [promotionsCategory.id],
	}),
}));
