// File: src/controllers/points.controller.ts
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { Env } from '../common/types';
import { userBalance } from '../entities/userBalance.entity';
import { history } from '../entities/history.entity';
import { promotions } from '../entities/promotions.entity';
import { apiKeyMiddleware } from '../middleware';
import { addPointsSchema, redeemPointsSchema } from '../schemas/points.schema';
import { eq, lte, gte, and } from 'drizzle-orm';


export const pointsController = new Hono<Env>();

// Endpoint for adding points
pointsController.post('/add', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();
	const parsed = addPointsSchema.safeParse(data);

	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const { user_id, amount } = parsed.data;

	// Check for any active multiplier promotions
    const now = new Date();
    const activeMultipliers = await db
      .select()
      .from(promotions)
      .where(
        and(
          lte(promotions.start_date, now),
          gte(promotions.end_date, now),
          eq(promotions.type, 'multiplier')
        )
      );

	// Assume a multiplier of 2 if any active multiplier promotion exists, otherwise 1
	const multiplier = activeMultipliers.length > 0 ? 2 : 1;
	const effectiveAmount = amount * multiplier;

	// Retrieve current user balance (assuming one record per user)
	const [existing] = await db.select().from(userBalance).where(eq(userBalance.user_id, user_id));

	let newBalance: number;
	if (existing) {
		// Convert stored amount to a number and update it
		newBalance = Number(existing.amount) + effectiveAmount;
		await db.update(userBalance)
			.set({ amount: newBalance.toString() })
			.where(eq(userBalance.user_id, user_id));
	} else {
		// If user doesn't exist, create a new balance record
		newBalance = effectiveAmount;
		await db
			.insert(userBalance)
			.values({
				user_id,
				amount: newBalance.toString(),
			})
			.returning();
	}

	// Record the transaction in the history table
	await db.insert(history)
		.values({
			user_id,
			description: 'Added points',
			points: effectiveAmount.toString(),
			pointsBefore: existing ? Number(existing.amount) : 0,
			pointsAfter: newBalance,
		})
		.returning();

	return c.json({ message: 'Points added successfully', newBalance, multiplierApplied: multiplier });
});

// Endpoint for redeeming points (remains unchanged)
pointsController.post('/redeem', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();
	const parsed = redeemPointsSchema.safeParse(data);

	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const { user_id, amount } = parsed.data;

	// Retrieve current user balance
	const [existing] = await db.select().from(userBalance).where(eq(userBalance.user_id, user_id));

	if (!existing || Number(existing.amount) < amount) {
		return c.json({ error: 'Insufficient points' }, 400);
	}

	const newBalance = Number(existing.amount) - amount;
	await db.update(userBalance)
		.set({ amount: newBalance.toString() })
		.where(eq(userBalance.user_id, user_id));

	// Record the redemption in the history table
	await db.insert(history)
		.values({
			user_id,
			description: 'Redeemed points',
			points: amount.toString(),
			pointsBefore: Number(existing.amount),
			pointsAfter: newBalance,
		})
		.returning();

	return c.json({ message: 'Points redeemed successfully', newBalance });
});

export default pointsController;
