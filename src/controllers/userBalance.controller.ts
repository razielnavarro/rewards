import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { userBalance } from "../entities/userBalance.entity";
import { Env } from "../common/types";
import { apiKeyMiddleware } from "../middleware";
import { eq } from "drizzle-orm";

export const userBalanceController = new Hono<Env>();

userBalanceController.get("/:userId", apiKeyMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const userId = c.req.param("userId");

  const [record] = await db.select().from(userBalance).where(eq(userBalance.user_id, userId));

  if (!record) {
    return c.json({ error: "User balance not found" }, 404);
  }

  return c.json({ record });
});

export default userBalanceController;
