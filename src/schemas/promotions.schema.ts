import { z } from 'zod';

export const promotionsSchema = z.object({
    user_id: z.string(),
    success: z.boolean(),
    ip: z.string(),
    country: z.string(),
    user_agent: z.string(),
});