import { sql } from 'drizzle-orm';
import { generateId } from '../utils/random';
import { baseEntityColumns } from './base.entity';

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const history = sqliteTable('history', {
	...baseEntityColumns,
	description: text(),
	points: text(),
	pointsBefore: integer(),
	pointsAfter: integer(),
});
