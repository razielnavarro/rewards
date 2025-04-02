import { Hono } from "hono";
import { Env } from "./common/types";
import {
  historyController,
  promotionTypeController,
  promotionsController,
  userPointsController,
  userPromotionsController,

} from "./controllers";
import pointsController from "./controllers/points.controller";

const app = new Hono<Env>();

app.route("/history", historyController);
app.route("/promotions", promotionsController);
app.route("/promotion-type", promotionTypeController);
app.route("/user-points", userPointsController);
app.route("/user-promotions", userPromotionsController);
app.route("/points", pointsController);

export default app;