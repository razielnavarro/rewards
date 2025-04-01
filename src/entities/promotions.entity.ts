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
    start_date: text(),
    end_date: text(),
	type: text(),
	is_premium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
});