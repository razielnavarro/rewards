import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns } from './base.entity';
import { promotions } from './promotions.entity';
import { relations } from 'drizzle-orm';

import { 
    sqliteTable, 
    text, 
    integer 
} from 'drizzle-orm/sqlite-core';

export const promotionsCategory = sqliteTable('promotionsCategory', {
    ...baseEntityColumns,
	is_multiplier: integer({ mode: 'boolean' }).notNull().default(false),
    amount: integer(),
});

export const promotionsCategoryRelations = relations(promotionsCategory, ({ many }) => ({
	promotions: many(promotions)
}));
