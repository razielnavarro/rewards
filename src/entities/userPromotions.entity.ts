import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';

import { 
    sqliteTable, 
    text, 
    integer 
} from 'drizzle-orm/sqlite-core';
import { baseEntityColumns } from './base.entity';

export const userPromotions = sqliteTable('userPromotions', {
...baseEntityColumns,
    user_id: text(),
    promotion_id: text(),
});