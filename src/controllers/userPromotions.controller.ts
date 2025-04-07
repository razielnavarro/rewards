import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { userPromotions } from '../entities/userPromotions.entity';
import { Env } from '../common/types';
import { userPromotionsSchema } from '../schemas/userPromotions.schema';
import { apiKeyMiddleware, authMiddleware } from '../middleware';
import { eq, and, gte, lte } from 'drizzle-orm';
import { promotions } from '../entities/promotions.entity';

export const userPromotionsController = new Hono<Env>();

// POST endpoint: Select a new userPromotion
userPromotionsController.post('/', authMiddleware, async (c) => {
	const db = drizzle(c.env.DB);

	// Extract JWT payload containing user id and premium status.
	const jwtPayload = c.get('jwtPayload') as { idCliente: string; isPremium?: boolean };
	if (!jwtPayload) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	// Read the incoming JSON body.
	const data = await c.req.json();
	// Override the user_id with the one from the JWT.
	const input = { ...data, user_id: jwtPayload.idCliente };

	// Validate input with your schema.
	const parsed = userPromotionsSchema.safeParse(input);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const { user_id, promotion_id } = parsed.data;

	// Check if the user already has an active promotion.
	const activePromotions = await db.select().from(userPromotions).where(eq(userPromotions.user_id, user_id));
	if (activePromotions.length > 0) {
		return c.json({ error: 'User already has an active promotion' }, 400);
	}

	// Get current time as a Date object.
	const now = new Date();

	// Query the promotions table to ensure the promotion exists and is active.
	const [promotionRecord] = await db
		.select()
		.from(promotions)
		.where(and(eq(promotions.id, promotion_id), lte(promotions.start_date, now), gte(promotions.end_date, now)));

	if (!promotionRecord) {
		return c.json({ error: 'Promotion not found or not active' }, 404);
	}

	// If the promotion is premium and the user isn't, return an error.
	if (promotionRecord.is_premium && !jwtPayload.isPremium) {
		return c.json({ error: 'You cannot select this premium promotion.' }, 400);
	}

	// Insert the new userPromotion record.
	const [record] = await db.insert(userPromotions).values(parsed.data).returning();

	return c.json({ record });
});

// GET endpoint: Retrieve a user's active promotion by userId
userPromotionsController.get('/:userId', authMiddleware, async (c) => {
	const db = drizzle(c.env.DB);

	// Extract the user ID from the URL parameter.
	const paramUserId = c.req.param('userId');

	// Extract the user ID from the JWT payload.
	const jwtPayload = c.get('jwtPayload') as { idCliente: string };
	if (!jwtPayload) {
		return c.json({ error: 'Unauthorized' }, 401);
	}
	const jwtUserId = jwtPayload.idCliente;

	// Ensure that the URL parameter matches the JWT user ID.
	if (paramUserId !== jwtUserId) {
		return c.json({ error: "Unauthorized to view another user's promotion" }, 403);
	}

	// Retrieve the active promotion record for this user.
	const [record] = await db.select().from(userPromotions).where(eq(userPromotions.user_id, paramUserId));
	if (!record) {
		return c.json({ error: 'No active promotions found' }, 404);
	}

	return c.json({ record });
});

export default userPromotionsController;
