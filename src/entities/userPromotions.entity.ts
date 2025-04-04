import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { promotions } from './promotions.entity';
import { relations } from 'drizzle-orm';

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { baseEntityColumns } from './base.entity';

export const userPromotions = sqliteTable('userPromotions', {
	...baseEntityColumns,
	user_id: text(),
	promotion_id: text()
		.notNull()
		.references(() => promotions.id),
});

export const userPromotionsRelations = relations(userPromotions, ({ one }) => ({
    promotions: one(promotions, {
        fields: [userPromotions.promotion_id],
        references: [promotions.id],
    }),
}));