import { Hono } from "hono";
import { Env } from "./common/types";
import {
  historyController,
  promotionTypeController,
  promotionsController,
  userPointsController,
  userPromotionsController,

} from "./controllers";

const app = new Hono<Env>();

app.route("/history", historyController);
app.route("/promotions", promotionsController);
app.route("/promotion-type", promotionTypeController);
app.route("/user-points", userPointsController);
app.route("/user-promotions", userPromotionsController);

export default app;