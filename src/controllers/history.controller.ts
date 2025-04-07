import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { history } from '../entities/history.entity';
import { Env } from '../common/types';
import { authMiddleware } from '../middleware'; // using JWT middleware
import { eq } from 'drizzle-orm';

export const historyController = new Hono<Env>();

historyController.get('/', authMiddleware, async (c) => {
	const db = drizzle(c.env.DB);

	// Extract user ID from the JWT payload.
	const jwtPayload = c.get('jwtPayload') as { idCliente: string };
	const user_id = jwtPayload.idCliente;

	// Query the history records using the userId from the JWT.
	const records = await db.select().from(history).where(eq(history.user_id, user_id));

	if (!records || records.length === 0) {
		return c.json({ message: 'No history records found' }, 404);
	}

	return c.json({ records });
});

export default historyController;
