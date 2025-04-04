import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { userPromotions } from '../entities/userPromotions.entity';
import { Env } from '../common/types';
import { userPromotionsSchema } from '../schemas/userPromotions.schema';
import { apiKeyMiddleware } from '../middleware';
import { eq, and, gte, lte } from 'drizzle-orm';
import { promotions } from '../entities/promotions.entity';

export const userPromotionsController = new Hono<Env>();

// POST endpoint: Select a new userPromotion
userPromotionsController.post('/', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();

	// Validate input with your schema
	const parsed = userPromotionsSchema.safeParse(data);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const { user_id, promotion_id } = parsed.data;

	// Check if user already has an active promotion
	const activePromotions = await db.select().from(userPromotions).where(eq(userPromotions.user_id, parsed.data.user_id));

	if (activePromotions.length > 0) {
		return c.json({ error: 'User already has an active promotion' }, 400);
	}

	// Get current time as a Date object
	const now = new Date();

	// Query the promotions table, filtering by ID and ensuring the promotion is active.
	const [promotionRecord] = await db
		.select()
		.from(promotions)
		.where(and(eq(promotions.id, promotion_id), lte(promotions.start_date, now), gte(promotions.end_date, now)));

	if (!promotionRecord) {
		return c.json({ error: 'Promotion not found or not active' }, 404);
	}

	// Insert the new userPromotion record, since the promotion is active.
	const [record] = await db.insert(userPromotions).values(parsed.data).returning();

	return c.json({ record });
});

// GET endpoint: Retrieve a user's active promotion by userId
userPromotionsController.get('/:userId', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const userId = c.req.param('userId');

	// Retrieve the active promotion record for this user.
	// If you have set up a relation in your userPromotions entity to join promotions details,
	// you can include it in your query using the "with" option.
	const [record] = await db.select().from(userPromotions).where(eq(userPromotions.user_id, userId));

	if (!record) {
		return c.json({ error: 'No active promotions found' }, 404);
	}

	return c.json({ record });
});

export default userPromotionsController;
