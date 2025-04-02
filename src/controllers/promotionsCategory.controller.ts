import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { promotionCategory } from '../entities/promotionsCategory.entity';
import { Env } from '../common/types';
import { promotionTypeSchema } from '../schemas/promotionsCategory.schema';
import { apiKeyMiddleware } from '../middleware';

export const promotionTypeController = new Hono<Env>();

promotionTypeController.post('/', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();

	const parsed = promotionTypeSchema.safeParse(data);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const [record] = await db.insert(promotionCategory).values(data).returning();
	return c.json({ record });
});

export default promotionTypeController;
