import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns } from './base.entity';

import { 
    sqliteTable, 
    text, 
    integer 
} from 'drizzle-orm/sqlite-core';

export const promotionCategory = sqliteTable('promotionCategory', {
    ...baseEntityColumns,
	is_multiplier: integer({ mode: 'boolean' }).notNull().default(false),
    amount: integer(),
});