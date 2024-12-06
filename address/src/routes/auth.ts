import { Hono } from "hono";
import { Container } from "../container";

const authRouter = new Hono();
const authController = Container.getAuthController();

authRouter.post("/login", (c) => authController.login(c));

export { authRouter };
