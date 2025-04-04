import { z } from 'zod';

export const userPromotionsSchema = z.object({
  user_id: z.string(),
  promotion_id: z.string(),
});
