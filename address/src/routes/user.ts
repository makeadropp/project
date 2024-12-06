import { Hono } from "hono";
import { Container } from "../container";
import { authMiddleware } from "../middleware/auth";

const userRouter = new Hono();
const userController = Container.getUserController();

userRouter.post("/", (c) => userController.create(c));
userRouter.use("/*", authMiddleware);
userRouter.get("/profile", async (c) => {
  const user = c.get('user');
    return c.json(user);
});

export { userRouter };
