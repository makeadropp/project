import { Context, Next } from "hono";
import { verify } from "jsonwebtoken";
import { JWTUser } from "../types/auth";

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authorization = c.req.header("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return c.json({ error: "No token provided" }, 401);
    }

    const token = authorization.split(" ")[1];
    const decoded = verify(token, process.env.JWT_SECRET || 'default_secret') as JWTUser;

    c.set('user', decoded);

    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
}
