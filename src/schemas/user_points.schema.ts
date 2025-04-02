import { z } from 'zod';

export const userPointsSchema = z.object({
  user_id: z.string(),
  balance: z.number(),
});
