import { z } from 'zod';

export const addPointsSchema = z.object({
    user_id: z.string(),
    amount: z.number().positive(),
});

export const redeemPointsSchema = z.object({
    user_id: z.string(),
    amount: z.number().positive(),
});