import { is } from 'drizzle-orm';
import { z } from 'zod';

export const promotionsSchema = z.object({
	title: z.string(),
	description: z.string(),
	start_date: z.coerce.number().int().min(0),
	end_date: z.coerce.number().int().min(0),
	promotion_category_type: z.enum(['multiplier']).optional().default('multiplier'),
	is_premium: z.boolean().optional().default(false),
});
