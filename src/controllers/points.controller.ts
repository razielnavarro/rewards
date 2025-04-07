import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { Env } from '../common/types';
import { userBalance } from '../entities/userBalance.entity';
import { history } from '../entities/history.entity';
import { apiKeyMiddleware, authMiddleware } from '../middleware';
import { addPointsSchema, redeemPointsSchema } from '../schemas/points.schema';
import { eq } from 'drizzle-orm';
import { userPromotions, promotions } from '../entities';
import { DOLLARS_TO_POINTS_MULTIPLIER } from '../common/constants';
import { schema } from '../entities';

export const pointsController = new Hono<Env>();

pointsController.post('/add', authMiddleware, async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const data = await c.req.json();
	const parsed = addPointsSchema.safeParse(data);

	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const { user_id, amount, message } = parsed.data;
	let basePoints = amount * DOLLARS_TO_POINTS_MULTIPLIER; // conversion of dollars to points
	let promotionMultiplier = 1; // default multiplier for promotions

	const now = new Date();

	// Query for an active user promotion.
	const activeUserPromotion = await db.query.userPromotions.findFirst({
		where: eq(userPromotions.user_id, user_id),
		with: {
			promotions: true, // select all columns from the related promotions table
		},
	});

	if (activeUserPromotion && activeUserPromotion.promotions) {
		const promotion = activeUserPromotion.promotions;
		if (promotion.start_date.getTime() <= now.getTime() && promotion.end_date.getTime() >= now.getTime()) {
			if (promotion.promotion_category_type === 'multiplier') {
				promotionMultiplier = promotion.amount;
			}
		}
	}

	// Calculate effective points.
	const effectivePoints = basePoints * promotionMultiplier;

	// Retrieve the user's current balance.
	const [existing] = await db.select().from(userBalance).where(eq(userBalance.user_id, user_id));

	let newBalance: number;
	if (existing) {
		newBalance = Number(existing.amount) + effectivePoints;
		await db.update(userBalance).set({ amount: newBalance.toString() }).where(eq(userBalance.user_id, user_id));
	} else {
		newBalance = effectivePoints;
		await db
			.insert(userBalance)
			.values({
				user_id,
				amount: newBalance.toString(),
			})
			.returning();
	}

	// Record the transaction in the history table.
	await db
		.insert(history)
		.values({
			user_id,
			description: 'Added points',
			points: effectivePoints.toString(),
			pointsBefore: existing ? Number(existing.amount) : 0,
			pointsAfter: newBalance,
		})
		.returning();

	return c.json({ message: message, newBalance, promotionMultiplierApplied: promotionMultiplier, pointsAdded: effectivePoints });
});

// Endpoint for redeeming points
pointsController.post('/redeem', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();
	const parsed = redeemPointsSchema.safeParse(data);

	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const { user_id, amount } = parsed.data;
	const [existing] = await db.select().from(userBalance).where(eq(userBalance.user_id, user_id));

	if (!existing) {
		return c.json({ error: 'No points available for redemption' }, 400);
	}

	const currentBalance = Number(existing.amount);

	// Check if the amount requested exceeds the current balance.
	if (amount > currentBalance) {
		return c.json({ error: 'Cannot redeem more points than available' }, 400);
	}

	// Enforce a minimum of 100 points to redeem.
	if (amount < 100) {
		return c.json({ error: 'Minimum redeemable points is 100' }, 400);
	}

	const newBalance = currentBalance - amount;

	await db.update(userBalance).set({ amount: newBalance.toString() }).where(eq(userBalance.user_id, user_id));

	await db
		.insert(history)
		.values({
			user_id,
			description: 'Redeemed points',
			points: amount.toString(),
			pointsBefore: currentBalance,
			pointsAfter: newBalance,
		})
		.returning();

	return c.json({ message: 'Points redeemed successfully', newBalance });
});

export default pointsController;
