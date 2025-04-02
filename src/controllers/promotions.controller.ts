import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { promotions } from "../entities/promotions.entity";
import { Env } from "../common/types";
import { promotionsSchema } from "../schemas/promotions.schema";
import { apiKeyMiddleware } from "../middleware";

export const promotionsController = new Hono<Env>();

promotionsController.post("/", apiKeyMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const data = await c.req.json();
  
  const parsed = promotionsSchema.safeParse(data);
  if (!parsed.success) {
    return c.json({ error: parsed.error }, 400);
  }
  
  const [record] = await db.insert(promotions).values(data).returning();
  return c.json({ record });
});

export default promotionsController;
