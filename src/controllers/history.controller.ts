import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { history } from "../entities/history.entity";
import { Env } from "../common/types";
import { historySchema } from "../schemas/history.schema";
import { apiKeyMiddleware } from "../middleware";
import { getConnInfo } from "hono/cloudflare-workers";
import { eq } from "drizzle-orm";

export const historyController = new Hono<Env>();

historyController.get("/:userId", apiKeyMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const userId = c.req.param("userId");

  const records = await db.select().from(history).where(eq(history.user_id, userId));
  
  if (!records || records.length === 0) {
    return c.json({ message: "No history records found" }, 404);
  }
  
  return c.json({ records });
});

