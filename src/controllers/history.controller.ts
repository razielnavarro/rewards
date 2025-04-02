import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { history } from "../entities/history.entity";
import { Env } from "../common/types";
import { historySchema } from "../schemas/history.schema";
import { apiKeyMiddleware } from "../middleware";
import { getConnInfo } from "hono/cloudflare-workers";

export const historyController = new Hono<Env>();

historyController.post("/", apiKeyMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const data = await c.req.json();
  const customerId = c.get("customerId");
  const user_agent = c.req.header("User-Agent") || "Unknown";
  const country = c.req.header("CF-IPCountry") || "Unknown";
  const ip = getConnInfo(c).remote.address || "Unknown";
  const inputData = { ...data, user_id: customerId, ip, user_agent, country };
  
  const parsed = historySchema.safeParse(inputData);
  if (!parsed.success) {
    return c.json({ error: parsed.error }, 400);
  }
  
  const [record] = await db.insert(history).values(inputData).returning();
  return c.json({ record });
});

export default historyController;
