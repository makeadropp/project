import { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../domain/entities/User";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
    userRole: UserRole;
    firstName: string;
    lastName: string;
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    // Set user information in context
    c.set("userId", decoded.userId);
    c.set("userRole", decoded.role);
    c.set("firstName", decoded.firstName);
    c.set("lastName", decoded.lastName);

    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }
}

export function roleGuard(...allowedRoles: UserRole[]) {
  return async function(c: Context, next: Next) {
    const userRole = c.get("userRole");
    
    if (!allowedRoles.includes(userRole)) {
      return c.json({ 
        error: "Forbidden - Insufficient permissions",
        required: allowedRoles,
        current: userRole
      }, 403);
    }

    await next();
  };
}

// Helper middleware to check if user is accessing their own resource
export function selfOrAdmin(paramName: string = "userId") {
  return async function(c: Context, next: Next) {
    const requestedUserId = c.req.param(paramName);
    const currentUserId = c.get("userId");
    const userRole = c.get("userRole");

    if (userRole === UserRole.ADMIN || currentUserId === requestedUserId) {
      await next();
    } else {
      return c.json({ 
        error: "Forbidden - Can only access own resources or must be admin" 
      }, 403);
    }
  };
}
