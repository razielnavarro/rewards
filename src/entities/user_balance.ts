import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns } from './base.entity';

import { 
    sqliteTable, 
    text, 
    integer 
} from 'drizzle-orm/sqlite-core';

export const userBalance = sqliteTable('userBalance', {
    ...baseEntityColumns,
    user_id: text(),
    amount: text(),
    reset_at: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
});