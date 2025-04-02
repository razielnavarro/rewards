import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

import { Env } from "./common/types";

export const apiKeyMiddleware = createMiddleware<Env>(async (c, next) => {
  const apiKey = c.req.header("api-key");
  if (!apiKey || apiKey !== c.env.API_KEY) {
    return c.json({ error: "No autorizado" }, 401);
  }
  await next();
});

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const apiKey = c.req.header("api-key");
  if (!apiKey || apiKey !== c.env.API_KEY) {
    const middleware = jwt({ secret: c.env.JWT_SECRET });
    return middleware(c, async () => {
      const jwtPayload = c.get("jwtPayload");
      if (jwtPayload) {
        c.set("customerId", jwtPayload.idCliente);
        console.log("customerId", jwtPayload.idCliente);
      }
      await next();
    });
  }

  await next();
});