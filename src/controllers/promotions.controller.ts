import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { promotions } from '../entities/promotions.entity';
import { Env } from '../common/types';
import { promotionsSchema } from '../schemas/promotions.schema';
import { apiKeyMiddleware } from '../middleware';
import { eq } from 'drizzle-orm';

export const promotionsController = new Hono<Env>();

// Partial update schema for PATCH requests
const promotionsUpdateSchema = promotionsSchema.partial();

// Create a new promotion
promotionsController.post('/', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const data = await c.req.json();

	const parsed = promotionsSchema.safeParse(data);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	const [record] = await db
		.insert(promotions)
		.values({
			...parsed.data,
			start_date: new Date(parsed.data.start_date),
			end_date: new Date(parsed.data.end_date),
		})
		.returning();
	return c.json({ record });
});

// Retrieve all promotions
promotionsController.get('/', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const records = await db.select().from(promotions);
	return c.json({ records });
});

// Retrieve a specific promotion by id
promotionsController.get('/:id', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const id = c.req.param('id');

	const [record] = await db.select().from(promotions).where(eq(promotions.id, id));
	if (!record) {
		return c.json({ error: 'Promotion not found' }, 404);
	}
	return c.json({ record });
});

// Update a promotion by id
promotionsController.patch('/:id', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const id = c.req.param('id');
	const data = await c.req.json();

	const parsed = promotionsUpdateSchema.safeParse(data);
	if (!parsed.success) {
		return c.json({ error: parsed.error }, 400);
	}

	// Convert timestamp values if they exist (assuming they're UNIX timestamps in seconds)
	const updateData: Record<string, any> = { ...parsed.data };
	if (updateData.start_date !== undefined) {
		updateData.start_date = new Date(updateData.start_date * 1000);
	}
	if (updateData.end_date !== undefined) {
		updateData.end_date = new Date(updateData.end_date * 1000);
	}

	const result = await db.update(promotions).set(updateData).where(eq(promotions.id, id)).returning();

	if (result.length === 0) {
		return c.json({ error: 'Promotion not found' }, 404);
	}
	return c.json({ record: result[0] });
});

// Delete a promotion by id
promotionsController.delete('/:id', apiKeyMiddleware, async (c) => {
	const db = drizzle(c.env.DB);
	const id = c.req.param('id');

	const result = await db.delete(promotions).where(eq(promotions.id, id)).returning();

	if (result.length === 0) {
		return c.json({ error: 'Promotion not found' }, 404);
	}
	return c.json({ message: 'Promotion deleted successfully' });
});

export default promotionsController;
