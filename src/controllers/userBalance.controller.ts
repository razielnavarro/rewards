import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { userBalance } from '../entities/userBalance.entity';
import { Env } from '../common/types';
import { authMiddleware } from '../middleware'; // <-- Use your JWT middleware
import { eq } from 'drizzle-orm';

export const userBalanceController = new Hono<Env>();

userBalanceController.get('/', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  
  // Get the user ID from the JWT payload
  const jwtPayload = c.get('jwtPayload') as { idCliente: string };
  const userId = jwtPayload.idCliente;

  // Query the user balance
  const [record] = await db.select().from(userBalance).where(eq(userBalance.user_id, userId));

  if (!record) {
    return c.json({ error: 'User balance not found' }, 404);
  }

  return c.json({ record });
});

export default userBalanceController;
