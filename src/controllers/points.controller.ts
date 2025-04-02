// File: src/controllers/points.controller.ts
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { Env } from '../common/types';
import { userBalance } from '../entities/userBalance.entity';
import { history } from '../entities/history.entity';
import { apiKeyMiddleware } from '../middleware';
import { addPointsSchema, redeemPointsSchema } from '../schemas/points.schema';
import { eq } from 'drizzle-orm';

export const pointsController = new Hono<Env>();

// Endpoint for adding points
pointsController.post('/add', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();
	const parsed = addPointsSchema.safeParse(data);

	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	// Destructure the multiplier from the parsed data.
	const { user_id, amount, multiplier } = parsed.data;
	// Calculate the effective points to add using the provided multiplier.
	const effectiveAmount = amount * multiplier;

	// Retrieve current user balance (assuming one record per user)
	const [existing] = await db.select().from(userBalance).where(eq(userBalance.user_id, user_id));

	let newBalance: number;
	if (existing) {
		newBalance = Number(existing.amount) + effectiveAmount;
		await db.update(userBalance)
			.set({ amount: newBalance.toString() })
			.where(eq(userBalance.user_id, user_id));
	} else {
		newBalance = effectiveAmount;
		await db.insert(userBalance)
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
	const [existing] = await db.select().from(userBalance).where(eq(userBalance.user_id, user_id));

	if (!existing || Number(existing.amount) < amount) {
		return c.json({ error: 'Insufficient points' }, 400);
	}

	const newBalance = Number(existing.amount) - amount;
	await db.update(userBalance)
		.set({ amount: newBalance.toString() })
		.where(eq(userBalance.user_id, user_id));

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
