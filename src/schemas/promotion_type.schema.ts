import { z } from 'zod';

export const promotionTypeSchema = z.object({
  name: z.string(),
  description: z.string(),
});
