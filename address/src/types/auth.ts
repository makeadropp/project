export interface JWTUser {
  userId: string;
  email: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: JWTUser;
  }
}
