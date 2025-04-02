import { z } from 'zod';

export const userBalanceSchema = z.object({
  user_id: z.string(),
  balance: z.number(),
});
