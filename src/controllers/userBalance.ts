import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { userBalance } from '../entities/userBalance';
import { Env } from '../common/types';
import { userPointsSchema } from '../schemas/userBalance';
import { apiKeyMiddleware } from '../middleware';

export const userPointsController = new Hono<Env>();

userPointsController.post('/', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();

	const parsed = userPointsSchema.safeParse(data);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const [record] = await db.insert(userBalance).values(data).returning();
	return c.json({ record });
});

export default userPointsController;
