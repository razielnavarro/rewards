import { z } from 'zod';

export const addPointsSchema = z.object({
    user_id: z.string(),
    amount: z.number().positive(),
    multiplier: z.number().int().min(1).max(4).optional().default(1),
    message: z.string()
});

export const redeemPointsSchema = z.object({
    user_id: z.string(),
    amount: z.number().positive(),
});