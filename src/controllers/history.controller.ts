import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { history } from "../entities/history.entity";
import { Env } from "../common/types";
import { authMiddleware } from "../middleware"; // using JWT middleware
import { eq } from "drizzle-orm";

export const historyController = new Hono<Env>();

historyController.get("/:userId", authMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  
  // Extract user ID from URL and from JWT payload
  const paramUserId = c.req.param("userId");
  const jwtPayload = c.get("jwtPayload") as { idCliente: string };
  const jwtUserId = jwtPayload.idCliente;

  // Ensure the user is only accessing their own history
  if (paramUserId !== jwtUserId) {
    return c.json({ error: "Unauthorized to view another user's history" }, 403);
  }

  // Query the history records for the given user
  const records = await db.select().from(history).where(eq(history.user_id, paramUserId));
  
  if (!records || records.length === 0) {
    return c.json({ message: "No history records found" }, 404);
  }
  
  return c.json({ records });
});

export default historyController;
