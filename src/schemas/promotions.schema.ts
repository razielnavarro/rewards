import { z } from 'zod';

export const promotionsSchema = z.object({
	title: z.string(),
	description: z.string(), 
	start_date: z.string(),
	end_date: z.string(),
	user_agent: z.string(),
	status: z.enum(['pending', 'active', 'expired']).optional().default('pending'),
});
