import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { userPromotions } from '../entities/userPromotions';
import { Env } from '../common/types';
import { userPromotionsSchema } from '../schemas/userPromotions';
import { apiKeyMiddleware } from '../middleware';

export const userPromotionsController = new Hono<Env>();

userPromotionsController.post('/', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();

	const parsed = userPromotionsSchema.safeParse(data);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const [record] = await db.insert(userPromotions).values(data).returning();
	return c.json({ record });
});

export default userPromotionsController;
