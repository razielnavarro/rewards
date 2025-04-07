import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';

import { Env } from './common/types';

export const apiKeyMiddleware = createMiddleware<Env>(async (c, next) => {
	const apiKey = c.req.header('api-key');
	if (!apiKey || apiKey !== c.env.API_KEY) {
		return c.json({ error: 'No autorizado' }, 401);
	}
	await next();
});

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
	const authHeader = c.req.header('Authorization');
	if (!authHeader) {
		return c.json({ error: 'Unauthorized' }, 401);
	}
	const token = authHeader.replace('Bearer ', '');
	const middleware = jwt({ secret: c.env.JWT_SECRET });
	return middleware(c, async () => {
		const jwtPayload = c.get('jwtPayload') as { idCliente: string; amount: number };
		if (jwtPayload) {
			console.log('customerId:', jwtPayload.idCliente, 'amountSpent:', jwtPayload.amount);
		}
		await next();
	});
});
