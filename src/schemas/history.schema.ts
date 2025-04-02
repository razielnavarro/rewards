import { z } from 'zod';

export const historySchema = z.object({
  action: z.string(),
  description: z.string(),
  ip: z.string().optional(),
  country: z.string().optional(),
  user_agent: z.string().optional(),
  created_at: z.string().optional(),
});
