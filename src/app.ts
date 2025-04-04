import { Hono } from 'hono';
import { Env } from './common/types';
import {
	historyController,
	promotionsController,
	userBalanceController,
	userPromotionsController,
	pointsController,
} from './controllers';

const app = new Hono<Env>();

app.route('/history', historyController);
app.route('/promotions', promotionsController);
app.route('/user-balance', userBalanceController);
app.route('/user-promotions', userPromotionsController);
app.route('/points', pointsController);

export default app;
