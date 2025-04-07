export * from './history.entity';
export * from './promotions.entity';
export * from './userBalance.entity';
export * from './userPromotions.entity';

import { history } from './history.entity';
import { promotions } from './promotions.entity';
import { userBalance } from './userBalance.entity';
import { userPromotions, userPromotionsRelations } from './userPromotions.entity';

export const schema = {
  history,
  promotions,
  userBalance,
  userPromotions,
  userPromotionsRelations
};